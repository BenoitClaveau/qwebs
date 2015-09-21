/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var http = require('http'),
    zlib = require('zlib'),
    Q = require('q'),
    DataError = require('./dataerror');

http.ServerResponse.prototype.setCharset = function (data) {

    if (!data.header['Content-Type'].match(/charset/)) {
        data.header['Content-Type'] += "; charset=utf-8";
    }
};

http.ServerResponse.prototype.setVary = function (data) {

    data.header['Vary'] = "Accept-Encoding";
};

http.ServerResponse.prototype.envelope = function (data) {
    var self = this;
    
    return Q.try(function () {
        var acceptEncoding = data.request.headers['accept-encoding'] || '';
        if (acceptEncoding.match(/\bgzip\b/)) {
            data.header['Content-Encoding'] = 'gzip';
            if (self.contentGzip)
                return { header: data.header, content: data.contentGzip, statusCode: data.statusCode };
            else {
                return Q.ninvoke(zlib, 'gzip', data.content).then(function (buffer) {
                    return { header: data.header, content: buffer, statusCode: data.statusCode };
                });
            }
        }
        else if (acceptEncoding.match(/\bdeflate\b/)) {
            data.header['Content-Encoding'] = 'deflate';
            if (self.contentDeflate)
                return { header: data.header, content: data.contentDeflate, statusCode: data.statusCode };
            else {
                return Q.ninvoke(zlib, 'deflate', data.content).then(function (buffer) {
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
        if (data == undefined) throw new Error('No data.');
        if (data.content == undefined) throw new Error('Content is null.');
        if (data.request == undefined) throw new Error('Request is null.');
        if (data.header == undefined) data.header = {};
        if (data.statusCode == undefined) data.statusCode = 200;
        
        data.header['Content-Type'] = data.header['Content-Type'] || "application/json"; 
        data.header['Expires'] = data.header['Expires'] || new Date(Date.now()).toString();
        data.header['Cache-Control'] = data.header['Cache-Control'] || 'no-cache';
                    
        if (data.header['Content-Type'].match(/\bapplication\/json\b/)) {
            if (!(data.content instanceof String))
                data.content = JSON.stringify(data.content);

            self.setCharset(data);
            self.setVary(data);
        }
        else if (data.header['Content-Type'].match(/\btext\/html\b/)) {
            self.setCharset(data);
            self.setVary(data);
        }
        return self.envelope(data);
    }).then(function (resp) {
        //console.log("RESPONSE ", data.request.url, " (", resp.statusCode, ") ", JSON.stringify(resp.header));
        self.writeHead(resp.statusCode, resp.header);
        self.write(resp.content);
        self.end();
        return self;
    });
};

http.ServerResponse.prototype.redirect = function (url) {
    var self = this;
    return Q.try(function () {
        self.writeHead(302, { 'Location': url ,'Content-Type': 'text/plain' });
        self.end();
        return self;
    });
};

