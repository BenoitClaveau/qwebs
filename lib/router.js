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
    Tree = require("./utils/tree"),
    Q = require("q"); 

function Router ($qwebs) {
    this.$qwebs = $qwebs;
    this.getTree = new Tree();
    this.postTree = new Tree();
    this.deleteTree = new Tree();
    this.putTree = new Tree();
    this.assetTree = new Tree();
};

Router.prototype.load = function() {
    var self = this;
    
    self.getTree.forEachRouter(function(router){ 
        router.load(self.$qwebs);
    });
    
    self.postTree.forEachRouter(function(router){ 
        router.load(self.$qwebs);
    });
    
    self.putTree.forEachRouter(function(router){ 
        router.load(self.$qwebs);
    });
    
    self.deleteTree.forEachRouter(function(router){ 
        router.load(self.$qwebs);
    });
};

Router.prototype.get = function(route) {
    var item = new Get(this.$qwebs, route);
    this.getTree.push(item);
    return item;
};

Router.prototype.post = function(route) {
    var item = new Post(this.$qwebs, route);
    this.postTree.push(item);
    return item;
};

Router.prototype.delete = function(route) {
    var item = new Delete(this.$qwebs, route);
    this.deleteTree.push(item);
    return item;
};

Router.prototype.put = function(route) {
    var item = new Put(this.$qwebs, route);
    this.putTree.push(item);
    return item;
};

Router.prototype.asset = function(asset) {
    this.assetTree.push(asset);
    return asset;
};

Router.prototype.assets = function(assets) {
    for (var i in assets) {
        var asset = assets[i];
        if (!asset) throw new DataError({ message: "Asset is not defined." });
        this.assetTree.push(asset);
    };
    return assets;
};

Router.prototype.leaf = function(request) {
    var self = this;
    switch(request.method)
        {
            case "GET":
                var asset = self.assetTree.findOne(request.pathname);
                if (asset) return asset;       
                return self.getTree.findOne(request.pathname);
            case "POST":
                return self.postTree.findOne(request.pathname);
            case "PUT":
                return self.putTree.findOne(request.pathname);
            case "DELETE":
                return self.deleteTree.findOne(request.pathname);
        };
};

Router.prototype.invoke = function(request, response, overridenUrl) {
    var self = this;
    
    return Q.try(function () {
        if(overridenUrl) request.url = overridenUrl;
        var part = url.parse(request.url);
        
        request.pathname = part.pathname;
        request.query = querystring.parse(part.query) || {};
        
        var leaf = self.leaf(request);
        if (leaf) {
            request.params = leaf.params;
            return leaf.router.invoke(request, response);
        }

        var header = { 
            "Content-Type": "text/html",
        };
        //throw new DataError({ statusCode: 404, message: "Unknwon route.", data: request.url, header: header });
    });
};

exports = module.exports = Router;