/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

require("./response"); //extend response

var querystring = require("querystring"),
    url = require("url"),
    Asset = require("./asset"),
    Get = require("./get"),
    Post = require("./post"),
    DataError = require("./dataerror"),
    assetService = require("./assetservice"),
    configService = require("./configservice"),
    bundleService = require("./bundleservice"),
    Q = require("q"); 

function Qwebs () {
    this.getList = [];
    this.postList = [];
    this.contentType = require("./contentType");
};

Qwebs.prototype.configure = function(filepath) {
    this.config = configService.create(filepath);
    return this;
};

Qwebs.prototype.init = function() {
    var self = this;
       
    return assetService.load(self, self.folder).then(function() {
        return bundleService.load(self, self.bundle).then(function(bundle) {
            var promises = [];
            for (var property in bundle) {
                var files = bundle[property];
                var newAsset = assetService.add(new Asset(self, property));
                promises.push(newAsset.initFromFiles(files));
            };
            return Q.all(promises);
        });
    }); 
};

Qwebs.prototype.get = function(route) {
    var item = new Get(this, route);
    this.getList.push(item);
    return item;
};

Qwebs.prototype.post = function(route) {
    var item = new Post(this, route);
    this.postList.push(item);
    return item;
};

Qwebs.prototype.invoke = function(request, response) {
    var self = this;
    return Q.try(function () {
        var part = url.parse(request.url);
        request.pathname = part.pathname;
        request.query = querystring.parse(part.query) || {};

        if (request.method === "GET") {
            if (assetService.match(request)) {
                return assetService.invoke(request, response);
            }
            for (var i = 0, length = self.getList.length; i < length; i++) {

                if (self.getList[i].match(request)) {
                    return self.getList[i].invoke(request, response);
                }
            }
        }

        if (request.method === "POST") {
            for (var i = 0, length = self.postList.length; i < length; i++) {
                if (self.postList[i].match(request)) {
                    return self.postList[i].invoke(request, response);
                }
            }
        }
        
        var header = { 
            "Content-Type": "text/html",
        };
        throw new DataError({ statusCode: 404, message: "Unknwon route.", data: request.url, header: header });
    });
};

Qwebs.prototype.reroute = function(url, request, response) {
    request.url = url;
    return assetService.invoke(request, response);
};

exports = module.exports = new Qwebs();