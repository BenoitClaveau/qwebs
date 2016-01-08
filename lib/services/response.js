/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var zlib = require("zlib"),
    Q = require("q"),
    crypto = require('crypto'),
    DataError = require("./../dataerror");

function ResponseService() {
};

ResponseService.prototype.constructor = ResponseService;

ResponseService.prototype.setCharset = function (data) {
    if (!data.header["Content-Type"].match(/charset/)) {
        data.header["Content-Type"] += "; charset=utf-8";
    }
};

ResponseService.prototype.setVary = function (data) {
    data.header["Vary"] = "Accept-Encoding";
};

ResponseService.prototype.fresh = function (data) {
    
    var etagMatches = true;
    var notModified = true;
    
    // fields
    var modifiedSince = data.request['If-Modified-Since'];
    var noneMatch = data.request['If-None-Match'];
    var lastModified = data.request['Last-Modified'];
    var etag = data.header["Etag"];
    var cc = data.request['Cache-Control'];
    
    // unconditional request
    if (!modifiedSince && !noneMatch) return false;
    
    // check for no-cache cache request directive
    if (cc && cc.indexOf('no-cache') !== -1) return false;  
    
    // parse if-none-match
    if (noneMatch) noneMatch = noneMatch.split(/ *, */);
    
    // if-none-match
    if (noneMatch) {
        etagMatches = noneMatch.some(function (match) {
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

ResponseService.prototype.redirect = function (response, url) {
    var self = this;
    return Q.try(function () {
        response.writeHead(302, { "Location": url ,"Content-Type": "text/plain" });
        response.end();
        return self;
    });
};

ResponseService.prototype.compress = function (data) {
    var self = this;
    
    return Q.try(function () {
 
        if (data.fresh) return { header: data.header, statusCode: 304 };
        
        if (data.header["Content-Encoding"] == "gzip") return self.compressGzip(data);
        else if (data.header["Content-Encoding"] == "deflate") return self.compressDeflate(data);
        else return data;
    });
};

ResponseService.prototype.compressGzip = function (data) {
    return Q.try(function () {
        
        if (data.contentGzip) //for assets
            return { header: data.header, content: data.contentGzip, statusCode: data.statusCode };
            
        else if (data.stream) //for stream
            return { header: data.header, stream: data.stream.pipe(zlib.createGzip()), statusCode: data.statusCode };
        
        else if (data.content) {
            return Q.ninvoke(zlib, "gzip", data.content).then(function (buffer) {
                return { header: data.header, content: buffer, statusCode: data.statusCode };
            });
        }
        
        return { header: data.header, statusCode: data.statusCode };
    });
};

ResponseService.prototype.compressDeflate = function (data) {
    return Q.try(function () {

        if (data.contentDeflate) //for assets
            return { header: data.header, content: data.contentDeflate, statusCode: data.statusCode };
            
        else if (data.stream) //for stream
            return { header: data.header, stream: data.stream.pipe(zlib.createDeflate()), statusCode: data.statusCode };
        
        else if (data.content) {
            return Q.ninvoke(zlib, "deflate", data.content).then(function (buffer) {
                return { header: data.header, content: buffer, statusCode: data.statusCode };
            });
        }
        
        return { header: data.header, statusCode: data.statusCode };
    });
};

ResponseService.prototype.envelope = function (data) {
    var self = this;

    return Q.try(function () {
        
        if (data == undefined) throw new DataError({ message: "No data." });
        if (data.request == undefined) throw new DataError({ message: "Request is null." });
        if (data.content == undefined && data.stream == undefined) throw new DataError({ message: "Content is null." });
        
        if (data.header == undefined) data.header = {};
        if (data.statusCode == undefined) data.statusCode = 200;
        
        var atime = new Date(Date.now());
        data.header["Content-Type"] = data.header["Content-Type"] || "application/json";
        data.header["Date"] = data.header["Date"] || atime.toUTCString();
        data.header["Expires"] = data.header["Expires"] || atime.toUTCString();
        data.header["Cache-Control"] = data.header["Cache-Control"] || "no-cache";
        
        if (data.header["Content-Type"].match(/\bapplication\/json\b/)) {
            if (!(data.content instanceof String))
                data.content = JSON.stringify(data.content);

            self.setCharset(data);
            self.setVary(data);
        }
        else if (data.header["Content-Type"].match(/\btext\/html\b/)) {
            self.setCharset(data);
            self.setVary(data);
        }
        
        if (!data.header["Etag"]) {
            if (data.content) data.header["Etag"] = crypto.createHash('sha256').update(data.content).digest("hex");
            //default etag stream is not managed. otherwise buffer will be read.
        }
        
        data.fresh = self.fresh(data);
        if (!data.fresh) data.header["Last-Modified"] = data.header["Last-Modified"] || atime.toUTCString();
        
        var acceptEncoding = data.request.headers["accept-encoding"] || "";
        if (acceptEncoding.match(/\bgzip\b/)) data.header["Content-Encoding"] = "gzip";
        if (acceptEncoding.match(/\bdeflate\b/)) data.header["Content-Encoding"] = "deflate";

        return data;
    });
};

ResponseService.prototype.send = function (response, data) {
    var self = this;

    return Q.try(function() {
        return self.envelope(data).then(function(data) {
            return self.compress(data).then(function(resp) {
                response.writeHead(resp.statusCode, resp.header);        
                if (resp.stream) resp.stream.pipe(response);
                else {
                    if (resp.content) response.write(resp.content);
                    response.end();
                }
                return self;
            });
        });
    });
};

exports = module.exports = ResponseService;
