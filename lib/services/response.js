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
    constructor($config) {
        this.$config = $config;
        if (!this.$config.cors) this.$config.cors = {};
    };

    _setCharset(data) {
        if (!data.headers["Content-Type"].match(/charset/)) {
            data.headers["Content-Type"] += "; charset=utf-8";
        }
    };

    _setVary(data) {
        data.headers["Vary"] = "Accept-Encoding";
    };

    _fresh(data) {
        
        let etagMatches = true;
        let notModified = true;
        
        // fields
        let modifiedSince = data.request['If-Modified-Since'];
        let noneMatch = data.request['If-None-Match'];
        let lastModified = data.request['Last-Modified'];
        let etag = data.headers["Etag"];
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
            if (!data.headers) data.headers = {};
            if (!data.statusCode) data.statusCode = 200;
            
            let atime = new Date(Date.now());
            
            data.headers["Date"] = data.headers["Date"] || atime.toUTCString();
            data.headers["Cache-Control"] = data.headers["Cache-Control"] || "no-cache";
            data.headers["Expires"] = data.headers["Expires"] || atime.toUTCString();
            data.headers["Content-Type"] = data.headers["Content-Type"] || "application/json";

            //cors activated by default
            if (this.$config.cors.enabled !== false) {
                data.headers["Access-Control-Allow-Origin"] = data.headers["Access-Control-Allow-Origin"] || this.$config.cors["allow-origin"] || "*";
                data.headers["Access-Control-Request-Method"] = data.headers["Access-Control-Request-Method"] || data.headers["Allow"] || data.request.method;
                data.headers["Access-Control-Max-Age"] = data.headers["Access-Control-Max-Age"] || this.$config.cors["max-age"] || "3600";
                data.headers["Access-Control-Allow-Headers"] = data.headers["Access-Control-Allow-Headers"] || this.$config.cors["allow-headers"] || "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With";
            }
            
            switch (this.method) {
                case "GET":
                case "POST":
                case "PUT":
                case "PATCH":
                case "DELETE":
                    if (!data.content && !data.stream) throw new DataError({ message: "Content is null.", data: data });
                    break;
                case "HEAD":
                    data.content = data.stream = null; //Only headers no content
                    break;
                case "OPTIONS":
                    data.headers["Content-Type"] = data.content = data.stream = null; //Only headers no content
                    break;
            }
            
            if (data.headers["Content-Type"]) {
                if (data.headers["Content-Type"].match(/\bapplication\/json\b/)) {
                    if (data.content && typeof data.content !== "string") {
                        try {
                            data.content = JSON.stringify(data.content);
                        }
                        catch(error) {
                            throw new DataError({ message: "Failed to stringify content", data: data, stack: error.stack });
                        }
                    }
                    else if (data.stream) {
                         data.stream = data.stream
                                            .once("error", responsePromise.reject.bind(responsePromise))
                                            .pipe(JSONStream.stringify());
                    }
                    this._setCharset(data);
                    this._setVary(data);
                }
                else if (data.headers["Content-Type"].match(/\btext\/html\b/)) {
                    this._setCharset(data);
                    this._setVary(data);
                }
                
                if (!data.headers["Etag"]) {
                    if (data.content) data.headers["Etag"] = crypto.createHash('sha256').update(data.content).digest("hex");
                    //default etag stream is not managed.
                }

                data.fresh = this._fresh(data);
                if (!data.fresh) data.headers["Last-Modified"] = data.headers["Last-Modified"] || atime.toUTCString();

                let acceptEncoding = data.request.headers["accept-encoding"] || "";
                if (acceptEncoding.match(/\bgzip\b/)) data.headers["Content-Encoding"] = "gzip";
                else if (acceptEncoding.match(/\bdeflate\b/)) data.headers["Content-Encoding"] = "deflate";

                if (data.stream) data.headers["Transfer-Encoding"] = data.headers["Transfer-Encoding"] || "chunked";
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
                
                data.headers = data.headers || {};
                data.statusCode = data.statusCode || 307;
                data.headers["Content-Type"] = data.headers["Content-Type"] || "text/html";
                data.headers["Location"] = data.headers["Location"] || data.url;

                response.writeHead(data.statusCode, data.headers);
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
            if (data.fresh) resolve({ headers: data.headers, statusCode: 304 });    
            else if (data.headers["Content-Encoding"] == "gzip") return this._compressGzip(responsePromise, data).then(resolve).catch(reject);
            else if (data.headers["Content-Encoding"] == "deflate") return this._compressDeflate(responsePromise, data).then(resolve).catch(reject);
            else return resolve(data);
        });
    };

    _compressGzip(responsePromise, data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.contentGzip) { //assets already gzipped
                    resolve({ headers: data.headers, content: data.contentGzip, statusCode: data.statusCode });
                }
                else if (data.stream) { //stream
                    data.stream = data.stream
                                    .once("error", responsePromise.reject.bind(responsePromise))
                                    .pipe(zlib.createGzip());

                    resolve({ headers: data.headers, stream: data.stream, statusCode: data.statusCode });
                }
                else if (data.content) {
                    zlib.gzip(data.content, (error, buffer) => {
                        if (error) reject(new DataError({ message: error.message, stack: error.stack }));
                        else resolve({ headers: data.headers, content: buffer, statusCode: data.statusCode });
                    });
                }
                else resolve({ headers: data.headers, statusCode: data.statusCode });
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
                    resolve({ headers: data.headers, content: data.contentDeflate, statusCode: data.statusCode });
                }
                else if (data.stream) { //stream
                    data.stream = data.stream
                                    .once("error", responsePromise.reject.bind(responsePromise))
                                    .pipe(zlib.createDeflate());

                    resolve({ headers: data.headers, stream: data.stream, statusCode: data.statusCode });
                }
                else if (data.content) {
                    zlib.deflate(data.content, (error, buffer) => {
                        if (error) reject(new DataError({ message: error.message, stack: error.stack }));
                        else resolve({ headers: data.headers, content: buffer, statusCode: data.statusCode });
                    });
                }
                else resolve({ headers: data.headers, statusCode: data.statusCode });
            }
            catch(error) {
                reject(error);
            }
        });
    };

    _write(responsePromise, response, resp) {
        try {
            response.writeHead(resp.statusCode, resp.headers);
            if (resp.stream) {
                resp.stream
                .once("error", responsePromise.reject.bind(responsePromise))
                .pipe(response)
                .once("error", responsePromise.reject.bind(responsePromise))
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
            if (response.headersSent) {         //Http headers could be already sending for stream. Change statusCode here has no effect bevause headers has already be sent
                response.close();               //Finally close the stream. This will produce an error code: HPE_INVALID_CHUNK_SIZE on the client side.
            }

            if (!(error instanceof DataError)) throw new DataError({ statusCode: 500, request: data.request, message: error.message, stack: error.stack });
            if (!error.request) error.request = data.request;
            throw error;
        });
    };
};

exports = module.exports = ResponseService;
