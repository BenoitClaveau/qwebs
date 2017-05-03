/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const http = require("http");
const zlib = require("zlib");
const crypto = require('crypto');
const DataError = require("./../dataerror");
const JSONStream = require("JSONStream");

class ResponseService {
    constructor() {
    };

    _setCharset(data) {
        if (!data.header["Content-Type"].match(/charset/)) {
            data.header["Content-Type"] += "; charset=utf-8";
        }
    };

    _setVary(data) {
        data.header["Vary"] = "Accept-Encoding";
    };

    _fresh(data) {
        
        let etagMatches = true;
        let notModified = true;
        
        // fields
        let modifiedSince = data.request['If-Modified-Since'];
        let noneMatch = data.request['If-None-Match'];
        let lastModified = data.request['Last-Modified'];
        let etag = data.header["Etag"];
        let cc = data.request['Cache-Control'];
        
        // unconditional request
        if (!modifiedSince && !noneMatch) return false;
        
        // check for no-cache cache request directive
        if (cc && cc.indexOf('no-cache') !== -1) return false;  
        
        // parse if-none-match
        if (noneMatch) noneMatch = noneMatch.split(/ *, */);
        
        // if-none-match
        if (noneMatch) {
            etagMatches = noneMatch.some(match => {
                return match === '*' || match === etag || match === 'W/' + etag;
            });
        }

        // if-modified-since
        if (modifiedSince) {
            modifiedSince = new Date(modifiedSince);
            lastModified = new Date(lastModified);
            notModified = lastModified <= modifiedSince;
        }
        return !! (etagMatches && notModified);
    };

    //https://books.google.fr/books?id=ZH6bpbcrlvYC&pg=PA99&lpg=PA99&dq=node.js+response+already+send&source=bl&ots=mNIrevjnN9&sig=xCYfRbG5XQ_y9aKsIhr1Kh-8Q4g&hl=fr&sa=X&ved=0ahUKEwi3zIKAqNPTAhVnBMAKHQvTB3AQ6AEIWjAG#v=onepage&q=node.js%20response%20already%20send&f=false
    _envelope(responsePromise, data) {
        try {
            if (!data) throw new DataError({ message: "No data." });
            if (!data.request) throw new DataError({ message: "Request is null.", data: data });
            if (!data.header) data.header = {};
            if (!data.statusCode) data.statusCode = 200;
            
            let atime = new Date(Date.now());
            
            data.header["Date"] = data.header["Date"] || atime.toUTCString();
            data.header["Cache-Control"] = data.header["Cache-Control"] || "no-cache";
            data.header["Expires"] = data.header["Expires"] || atime.toUTCString();
            data.header["Content-Type"] = data.header["Content-Type"] || "application/json";
            
            switch (this.method) {
                case "GET":
                case "POST":
                case "PUT":
                case "DELETE":
                    if (!data.content && !data.stream) throw new DataError({ message: "Content is null.", data: data });
                    break;
                case "OPTIONS":
                    data.content = data.stream = null; //Only header no content
                    break;
                case "OPTIONS":
                    data.header["Content-Type"] = data.content = data.stream = null; //Only header no content
                    break;
            }
            
            if (data.header["Content-Type"]) {
                if (data.header["Content-Type"].match(/\bapplication\/json\b/)) {
                    if (data.content && !(data.content instanceof String)) {
                        try {
                            data.content = JSON.stringify(data.content);
                        }
                        catch(error) {
                            throw new DataError({ message: "Failed to stringify content", data: data, stack: error.stack });
                        }
                    }
                    else if (data.stream) {
                        data.stream = data.stream.once("error", error => {
                            responsePromise.reject(error);
                        }).pipe(JSONStream.stringify());
                    }
                    this._setCharset(data);
                    this._setVary(data);
                }
                else if (data.header["Content-Type"].match(/\btext\/html\b/)) {
                    this._setCharset(data);
                    this._setVary(data);
                }
                
                if (!data.header["Etag"]) {
                    if (data.content) data.header["Etag"] = crypto.createHash('sha256').update(data.content).digest("hex");
                    //default etag stream is not managed.
                }

                data.fresh = this._fresh(data);
                if (!data.fresh) data.header["Last-Modified"] = data.header["Last-Modified"] || atime.toUTCString();

                let acceptEncoding = data.request.headers["accept-encoding"] || "";
                if (acceptEncoding.match(/\bgzip\b/)) data.header["Content-Encoding"] = "gzip";
                else if (acceptEncoding.match(/\bdeflate\b/)) data.header["Content-Encoding"] = "deflate";

                if (data.stream) data.header["Transfer-Encoding"] = data.header["Transfer-Encoding"] || "chunk";
                //TODO Content-Length
            }
        }
        catch(error) {
            responsePromise.reject(error);
        }
    };

    /* Promise ---------- */

    redirect(response, data) {
        return new Promise((resolve, reject) => {
            try {
                if (!data) throw new DataError({ message: "No data." });
                if (!data.url) throw new DataError({ message: "No url." });
                
                data.header = data.header || {};
                data.statusCode = data.statusCode || 307;
                data.header["Content-Type"] = data.header["Content-Type"] || "text/html";
                data.header["Location"] = data.header["Location"] || data.url;

                response.writeHead(data.statusCode, data.header);
                response.end();
                resolve(this);
            } 
            catch(error) {
                return reject(error);
            }
        });
    };

    _compress(responsePromise, data) {
        return new Promise((resolve, reject) => {
            if (data.fresh) resolve({ header: data.header, statusCode: 304 });    
            else if (data.header["Content-Encoding"] == "gzip") return this._compressGzip(responsePromise, data).then(resolve).catch(reject);
            else if (data.header["Content-Encoding"] == "deflate") return this._compressDeflate(responsePromise, data).then(resolve).catch(reject);
            else return resolve(data);
        });
    };

    _compressGzip(responsePromise, data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.contentGzip) { //assets already gzipped
                    resolve({ header: data.header, content: data.contentGzip, statusCode: data.statusCode });
                }
                else if (data.stream) { //stream
                    data.stream = data.stream
                                    .once("error", error => {
                                        responsePromise.reject(error);
                                    })
                                    .pipe(zlib.createGzip());

                    resolve({ header: data.header, stream: data.stream, statusCode: data.statusCode });
                }
                else if (data.content) {
                    zlib.gzip(data.content, (error, buffer) => {
                        if (error) reject(new DataError({ message: error.message, stack: error.stack }));
                        else resolve({ header: data.header, content: buffer, statusCode: data.statusCode });
                    });
                }
                else resolve({ header: data.header, statusCode: data.statusCode });
            }
            catch(error) {
                reject(error);
            }
        });
    };

    _compressDeflate(responsePromise, data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.contentDeflate) { //assets already deflated
                    resolve({ header: data.header, content: data.contentDeflate, statusCode: data.statusCode });
                }
                else if (data.stream) { //stream
                    data.stream = data.stream
                                    .once("error", error => {
                                        responsePromise.reject(error);
                                    })
                                    .pipe(zlib.createDeflate());

                    resolve({ header: data.header, stream: data.stream, statusCode: data.statusCode });
                }
                else if (data.content) {
                    zlib.deflate(data.content, (error, buffer) => {
                        if (error) reject(new DataError({ message: error.message, stack: error.stack }));
                        else resolve({ header: data.header, content: buffer, statusCode: data.statusCode });
                    });
                }
                else resolve({ header: data.header, statusCode: data.statusCode });
            }
            catch(error) {
                reject(error);
            }
        });
    };

    _write(responsePromise, response, resp) {
        try {
            response.writeHead(resp.statusCode, resp.header);
            if (resp.stream) {
                let open = false;
                resp.stream
                .on("data", function(data) {
                    open = true;
                })
                .once("error", function(error) {
                    if (open) {
                        response.statusCode = 500;
                        response.end(http.STATUS_CODE[response.statusCode]);
                    }
                    responsePromise.reject(error);
                })
                .pipe(response)
                .once("error", function(error) {
                    response.statusCode = 500;
                    response.end(http.STATUS_CODE[response.statusCode]);
                    responsePromise.reject(error);
                })
                .once("finish", () => {
                    responsePromise.resolve(resp);
                });
            }
            else {
                if (resp.content) response.end(resp.content);
                else response.end();
                responsePromise.resolve(resp);
            }
        }
        catch(error) {
            responsePromise.reject(error);
        }
    }

    send(response, data) {
        return new Promise((resolve, reject) => {
            var responsePromise = {
                resolve: resolve,
                reject: reject
            };

            this._envelope(responsePromise, data);
            return this._compress(responsePromise, data).then(resp => {
                this._write(responsePromise, response, resp);
            }).catch(responsePromise.reject);
        }).catch(error => {
            if (!(error instanceof DataError)) throw new DataError({ statusCode: 500, request: data.request, message: error.message, stack: error.stack });
            if (!error.request) error.request = data.request;
            throw error;
        });
    };
};

exports = module.exports = ResponseService;
