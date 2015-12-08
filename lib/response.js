/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var http = require("http"),
    zlib = require("zlib"),
    Q = require("q"),
    crypto = require('crypto'),
    DataError = require("./dataerror");

http.ServerResponse.prototype.setCharset = function (data) {
    if (!data.header["Content-Type"].match(/charset/)) {
        data.header["Content-Type"] += "; charset=utf-8";
    }
};

http.ServerResponse.prototype.setVary = function (data) {
    data.header["Vary"] = "Accept-Encoding";
};

http.ServerResponse.prototype.redirect = function (url) {
    var self = this;
    return Q.try(function () {
        self.writeHead(302, { "Location": url ,"Content-Type": "text/plain" });
        self.end();
        return self;
    });
};

http.ServerResponse.prototype.envelope = function (data) {
    var self = this;
    
    return Q.try(function () {
        if (self.fresh(data)) return { header: data.header, statusCode: 304 };

        var acceptEncoding = data.request.headers["accept-encoding"] || "";
        if (acceptEncoding.match(/\bgzip\b/)) {
            data.header["Content-Encoding"] = "gzip";
            if (self.contentGzip)
                return { header: data.header, content: data.contentGzip, statusCode: data.statusCode };
            else {
                return Q.ninvoke(zlib, "gzip", data.content).then(function (buffer) {
                    return { header: data.header, content: buffer, statusCode: data.statusCode };
                });
            }
        }
        else if (acceptEncoding.match(/\bdeflate\b/)) {
            data.header["Content-Encoding"] = "deflate";
            if (self.contentDeflate)
                return { header: data.header, content: data.contentDeflate, statusCode: data.statusCode };
            else {
                return Q.ninvoke(zlib, "deflate", data.content).then(function (buffer) {
                    return { header: data.header, content: buffer, statusCode: data.statusCode };
                });
            }
        } else {
            return { header: data.header, content: data.content, statusCode: data.statusCode };
        }
    });
};

http.ServerResponse.prototype.send = function (data) {
    var self = this;

    return Q.try(function () { 
        if (data == undefined) throw new DataError({ message: "No data." });
        if (data.content == undefined) throw new DataError({ message: "Content is null." });
        if (data.request == undefined) throw new DataError({ message: "Request is null." });
        if (data.header == undefined) data.header = {};
        if (data.statusCode == undefined) data.statusCode = 200;
        
        var atime = Date.now();
        data.header["Content-Type"] = data.header["Content-Type"] || "application/json"; 
        data.header["Expires"] = data.header["Expires"] || new Date(atime).toString();
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
            data.header["Etag"] = crypto.createHash('sha256').update(data.content).digest("hex");
        }
        
        return self.envelope(data);
    }).then(function (resp) {
        //console.log("RESPONSE ", data.request.url, " (", resp.statusCode, ") ", JSON.stringify(resp.header));
        self.writeHead(resp.statusCode, resp.header);
        if (resp.content) self.write(resp.content);
        self.end();
        return self;
    });
};

http.ServerResponse.prototype.fresh = function (data) {
    
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
