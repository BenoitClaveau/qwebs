/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const zlib = require("zlib");
const crypto = require('crypto');
const DataError = require("./../dataerror");

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

    redirect(response, url) {
        return Promise.resolve().then(() => {
            response.writeHead(302, { "Location": url ,"Content-Type": "text/plain" });
            response.end();
            return this;
        });
    };

    compress(data) {
        return Promise.resolve().then(() => {
            if (data.fresh) return { header: data.header, statusCode: 304 };    
            if (data.header["Content-Encoding"] == "gzip") return this.compressGzip(data);
            else if (data.header["Content-Encoding"] == "deflate") return this.compressDeflate(data);
            else return data;
        });
    };

    compressGzip(data) {
        return Promise.resolve().then(() => {
            if (data.contentGzip) { //assets already gzip
                return { header: data.header, content: data.contentGzip, statusCode: data.statusCode };
            }
            else if (data.stream) { // stream
                let onerror = error => {
                    throw new DataError({ message: "Failed to gzip content.", stack: error.stack });
                };
                let stream = data.stream
                                .on("error", onerror)
                                .pipe(zlib.createGzip())
                                .on("error", onerror);
                return { header: data.header, stream: stream, statusCode: data.statusCode };
            }
            else if (data.content) {
                return new Promise((resolve, reject) => {
                    zlib.gzip(data.content, (err, buffer) => {
                        if (err) reject(err);
                        else resolve({ header: data.header, content: buffer, statusCode: data.statusCode });
                    });
                });
            }
            return { header: data.header, statusCode: data.statusCode };
        });
    };

    compressDeflate(data) {
        return Promise.resolve().then(() => {
            if (data.contentDeflate) {//assets already deflate
                return { header: data.header, content: data.contentDeflate, statusCode: data.statusCode };
            }
            else if (data.stream) { //stream
                let onerror = error => {
                    throw new DataError({ message: "Failed to defalte content.", stack: error.stack });
                };
                let stream = data.stream
                                .on("error", onerror)
                                .pipe(zlib.createDeflate())
                                .on("error", onerror);
                return { header: data.header, stream: stream, statusCode: data.statusCode };
            }
            else if (data.content) {
                return new Promise((resolve, reject) => {
                    zlib.deflate(data.content, (err, buffer) => {
                        if (err) reject(err);
                        else resolve({ header: data.header, content: buffer, statusCode: data.statusCode });
                    });
                });
            }
            return { header: data.header, statusCode: data.statusCode };
        });
    };

    envelope(data) {
        return Promise.resolve().then(() => {
            if (!data) throw new DataError({ message: "No data." });
            if (!data.request) throw new DataError({ message: "Request is null." });
            if (!data.content && !data.stream) throw new DataError({ message: "Content is null." });
            
            if (!data.header) data.header = {};
            if (!data.statusCode) data.statusCode = 200;

            let atime = new Date(Date.now());
            data.header["Content-Type"] = data.header["Content-Type"] || "application/json";
            data.header["Date"] = data.header["Date"] || atime.toUTCString();
            data.header["Expires"] = data.header["Expires"] || atime.toUTCString();
            data.header["Cache-Control"] = data.header["Cache-Control"] || "no-cache";

            if (data.header["Content-Type"].match(/\bapplication\/json\b/)) {
                if (!(data.content instanceof String)) {
                    try {
                        data.content = JSON.stringify(data.content);
                    }
                    catch(error) {
                        throw new DataError({ message: "Failed to stringify content", data: {content: data.content }, stack: error.stack });
                    }
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
            
            return data;
        });
    };

    send(response, data) {
        return Promise.resolve().then(() => {
            
            response.on("error", error => {
                throw new DataError({ message: "Failed to send content.", data: { message: error.message }, stack: error.stack });
            });
            
            return this.envelope(data).then(data => {
                return this.compress(data).then(resp => {
                    try {
                        response.writeHead(resp.statusCode, resp.header);
                        if (resp.stream) {
                            let onerror = error => {
                                throw new DataError({ message: "Failed to stream response.", data: { message: error.message }, stack: error.stack });
                            };
                            resp.stream
                                .on("error", onerror)
                                .pipe(response)
                                .on("error", onerror);
                        }
                        else {
                            if (resp.content) return response.end(resp.content);
                            else return response.end();
                        }
                    }
                    catch (error) {
                        throw new DataError({ message: "Failed to send response.", data: { message: error.message, status: resp.statusCode, header: resp.header }, stack: error.stack });
                    }
                }).then(() => {
                    return this;
                });
            });
        });
    };
};

exports = module.exports = ResponseService;