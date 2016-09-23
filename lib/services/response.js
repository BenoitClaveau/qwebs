/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const zlib = require("zlib");
const crypto = require('crypto');
const DataError = require("./../dataerror");
const JSONStream = require("JSONStream");

class ResponseService {
    constructor() {
    };

    setCharset(data) {
        if (!data.header["Content-Type"].match(/charset/)) {
            data.header["Content-Type"] += "; charset=utf-8";
        }
    };

    setVary(data) {
        data.header["Vary"] = "Accept-Encoding";
    };

    fresh(data) {
        
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

    envelope(data) {
        if (!data) throw new DataError({ message: "No data." });
        if (!data.request) throw new DataError({ message: "Request is null." });
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
                if (!data.content && !data.stream) throw new DataError({ message: "Content is null." });
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
                        throw new DataError({ message: "Failed to stringify content", data: {content: data.content }, stack: error.stack });
                    }
                }
                else if (data.stream) {
                    data.stream = data.stream.pipe(JSONStream.stringify());
                }
                this.setCharset(data);
                this.setVary(data);
            }
            else if (data.header["Content-Type"].match(/\btext\/html\b/)) {
                this.setCharset(data);
                this.setVary(data);
            }
            
            if (!data.header["Etag"]) {
                if (data.content) data.header["Etag"] = crypto.createHash('sha256').update(data.content).digest("hex");
                //default etag stream is not managed.
            }

            data.fresh = this.fresh(data);
            if (!data.fresh) data.header["Last-Modified"] = data.header["Last-Modified"] || atime.toUTCString();

            let acceptEncoding = data.request.headers["accept-encoding"] || "";
            if (acceptEncoding.match(/\bgzip\b/)) data.header["Content-Encoding"] = "gzip";
            else if (acceptEncoding.match(/\bdeflate\b/)) data.header["Content-Encoding"] = "deflate";
        }
    };

    /* Promise ---------- */

    redirect(response, data) {
        try {
            if (!data) throw new DataError({ message: "No data." });
            if (!data.url) throw new DataError({ message: "No url." });
            
            data.header = data.header || {};
            data.statusCode = data.statusCode || 307;
            data.header["Content-Type"] = data.header["Content-Type"] || "text/html";
            data.header["Location"] = data.header["Location"] || data.url;

            response.writeHead(data.statusCode, data.header);
            response.end();
            return Promise.resolve(this);
        } 
        catch(error) {
            return Promise.reject(error);
        }
    };

    compress(data) {
        try {
            if (data.fresh) return Promise.resolve({ header: data.header, statusCode: 304 });    
            else if (data.header["Content-Encoding"] == "gzip") return this.compressGzip(data);
            else if (data.header["Content-Encoding"] == "deflate") return this.compressDeflate(data);
            else return Promise.resolve(data);
        } catch(error) {
            return Promise.reject(error);
        }
    };

    compressGzip(data) {
        return new Promise((resolve, reject) => {
            if (data.contentGzip) { //assets already gzipped
                resolve({ header: data.header, content: data.contentGzip, statusCode: data.statusCode });
            }
            else if (data.stream) { //stream
                let stream = data.stream.pipe(zlib.createGzip());
                return { header: data.header, stream: stream, statusCode: data.statusCode };
            }
            else if (data.content) {
                zlib.gzip(data.content, (error, buffer) => {
                    if (error) reject(new DataError({ message: error.message, stack: error.stack }));
                    else resolve({ header: data.header, content: buffer, statusCode: data.statusCode });
                });
            }
            else resolve({ header: data.header, statusCode: data.statusCode });
        });
    };

    compressDeflate(data) {
        return new Promise((resolve, reject) => {
            if (data.contentDeflate) { //assets already deflated
                resolve({ header: data.header, content: data.contentDeflate, statusCode: data.statusCode });
            }
            else if (data.stream) { //stream
                let stream = data.stream.pipe(zlib.createDeflate());
                return { header: data.header, stream: stream, statusCode: data.statusCode };
            }
            else if (data.content) {
                zlib.deflate(data.content, (error, buffer) => {
                    if (error) reject(new DataError({ message: error.message, stack: error.stack }));
                    else resolve({ header: data.header, content: buffer, statusCode: data.statusCode });
                });
            }
            else resolve({ header: data.header, statusCode: data.statusCode });
        });
    };

    send(response, data) {
        try {
            this.envelope(data);
            return this.compress(data).then(resp => {
                return new Promise((resolve, reject) => {
                    try {
                        response.writeHead(resp.statusCode, resp.header);
                        if (resp.stream) {
                            resp.stream
                                .on("error", error => {
                                    reject(new DataError({ message: error.message, stack: error.stack }));
                                }).pipe(response)
                                .on("error", error => {
                                    reject(new DataError({ message: error.message, stack: error.stack }));
                                }).on("finish", () => {
                                    resolve(resp);
                                });
                        }
                        else {
                            if (resp.content) response.end(resp.content);
                            else response.end();
                            resolve(resp);
                        }
                    }
                    catch (error) {
                        reject(new DataError({ message: error.message, stack: error.stack }));
                    }
                });
            });
        } 
        catch(error) {
            return Promise.reject(error);
        }
    };
};

exports = module.exports = ResponseService;
