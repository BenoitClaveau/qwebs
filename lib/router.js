/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var url = require("url"),
    querystring = require("querystring"),
    Get = require("./routes/get"),
    Post = require("./routes/post"),
    Delete = require("./routes/delete"),
    Put = require("./routes/put"),
    Asset = require("./routes/asset"),
    DataError = require("./dataerror"),
    Q = require("q"); 

function Router ($qwebs) {
    this.$qwebs = $qwebs;
    this.getList = [];
    this.postList = [];
    this.deleteList = [];
    this.putList = [];
    this.assetList = [];
};

Router.prototype.load = function() {
    var self = this;
    
    for (var i in self.getList) {
        this.getList[i].load(self.$qwebs);
    };
    
    for (var i in self.postList) {
        this.postList[i].load(self.$qwebs);
    };
    
    for (var i in self.putList) {
        this.putList[i].load(self.$qwebs);
    };
    
    for (var i in self.deleteList) {
        this.deleteList[i].load(self.$qwebs);
    };
};

Router.prototype.get = function(route) {
    var item = new Get(this.$qwebs, route);
    this.getList.push(item);
    return item;
};

Router.prototype.post = function(route) {
    var item = new Post(this.$qwebs, route);
    this.postList.push(item);
    return item;
};

Router.prototype.delete = function(route) {
    var item = new Delete(this.$qwebs, route);
    this.deleteList.push(item);
    return item;
};

Router.prototype.put = function(route) {
    var item = new Put(this.$qwebs, route);
    this.putList.push(item);
    return item;
};

Router.prototype.asset = function(asset) {
    this.assetList.push(asset);
    return asset;
};

Router.prototype.assets = function(assets) {
    for (var i in assets) {
        var asset = assets[i];
        if (!asset) throw new DataError({ message: "Asset is not defined." });
        this.assetList.push(asset);
    };
    return assets;
};

Router.prototype.findOneAsset = function(route) {
    if (route == undefined) throw new DataError({ message: "Route is not defined." });

    for (var i in this.assetList) {
        var asset = this.assetList[i];
        if (asset.route == route) return asset;
    };
    return null;
};

Router.prototype.invoke = function(request, response, overridenUrl) {
    var self = this;
    
    return Q.try(function () {
        if(overridenUrl) request.url = overridenUrl;
        var part = url.parse(request.url);
        
        request.pathname = part.pathname;
        request.query = querystring.parse(part.query) || {};
    
        if (request.method === "GET") {
            var asset = self.findOneAsset(request.url);
            if (asset) return asset.invoke(request, response);
            
            for (var i = 0, length = self.getList.length; i < length; i++) {
                var itemGet = self.getList[i];
                if (itemGet.match(request)) {
                    return itemGet.invoke(request, response);
                }
            }
        }
        
        if (request.method === "POST") {
            
            for (var i = 0, length = self.postList.length; i < length; i++) {
                var itemPost = self.postList[i];
                if (itemPost.match(request)) {
                    return itemPost.invoke(request, response);
                }
            }
        }
        
        if (request.method === "PUT") {
            for (var i = 0, length = self.putList.length; i < length; i++) {
                var itemPut = self.putList[i];
                if (itemPut.match(request)) {
                    return itemPut.invoke(request, response);
                }
            }
        }
        
        if (request.method === "DELETE") {
            for (var i = 0, length = self.deleteList.length; i < length; i++) {
                var itemDelete = self.deleteList[i];
                if (itemDelete.match(request)) {
                    return itemDelete.invoke(request, response);
                }
            }
        }
        
        var header = { 
            "Content-Type": "text/html",
        };
        throw new DataError({ statusCode: 404, message: "Unknwon route.", data: request.url, header: header });
    });
};

exports = module.exports = Router;