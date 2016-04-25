/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const url = require("url");
const querystring = require("querystring");
const Get = require("./routes/get");
const Post = require("./routes/post");
const Delete = require("./routes/delete");
const Put = require("./routes/put");
const Asset = require("./routes/asset");
const DataError = require("./dataerror");
const Tree = require("./utils/tree");
const Q = require("q"); 

class Router {
    constructor($qwebs) {
        this.$qwebs = $qwebs;
        this.getTree = new Tree();
        this.postTree = new Tree();
        this.deleteTree = new Tree();
        this.putTree = new Tree();
        this.assetTree = new Tree();
    };

    load() {
        this.getTree.load();
        this.postTree.load();
        this.putTree.load();
        this.deleteTree.load();
    };

    get(route) {
        let item = new Get(this.$qwebs, route);
        this.getTree.push(item);
        return item;
    };

    post(route) {
        let item = new Post(this.$qwebs, route);
        this.postTree.push(item);
        return item;
    };

    delete(route) {
        let item = new Delete(this.$qwebs, route);
        this.deleteTree.push(item);
        return item;
    };

    put(route) {
        let item = new Put(this.$qwebs, route);
        this.putTree.push(item);
        return item;
    };

    asset(asset) {
        this.assetTree.push(asset);
        return asset;
    };

    assets(assets) {
        let count = assets.length;
        for (let i = 0; i < count; i++) {
            let asset = assets[i];
            if (!asset) throw new DataError({ message: "Asset is not defined." });
            this.assetTree.push(asset);
        }
        return assets;
    };

    leaf(request) {
        let self = this;
        switch(request.method) {
            case "GET":
                let asset = self.assetTree.findOne(request.pathname);
                if (asset) return asset;       
                return self.getTree.findOne(request.pathname);
            case "POST":
                return self.postTree.findOne(request.pathname);
            case "PUT":
                return self.putTree.findOne(request.pathname);
            case "DELETE":
                return self.deleteTree.findOne(request.pathname);
            default:
                throw new DataError({ message: "Method is unknown." });
        };
    };

    invoke(request, response, overridenUrl) {
        let self = this;
        
        return Q.try(function () {

            if(overridenUrl) request.url = overridenUrl;
            let part = url.parse(request.url);
            
            request.pathname = part.pathname;
            request.query = querystring.parse(part.query) || {};
            
            let leaf = self.leaf(request);
            if (leaf) {
                
                if (!self.$qwebs.loaded) {
                    let header = { 
                        "Content-Type": "text/html",
                        "Retry-After": 30
                    };
                    throw new DataError({ statusCode: 503, message: "Server is loading.", data: { url: request.url }, header: header });
                }
                
                request.params = leaf.params;
                return leaf.router.invoke(request, response);
            }
            else throw new DataError({ statusCode: 404, data: { url: request.url }});
        });
    };
};

exports = module.exports = Router;
