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
const Options = require("./routes/options");
const Asset = require("./routes/asset");
const DataError = require("./dataerror");
const Tree = require("./nodes/tree");
const OptionsLeaf = require("./nodes/optionsLeaf");

class Router {
    constructor($qwebs) {
        this.$qwebs = $qwebs;
        this.getTree = new Tree();
        this.postTree = new Tree();
        this.deleteTree = new Tree();
        this.putTree = new Tree();
        this.assetTree = new Tree();
        this.optionsLeaf = new OptionsLeaf(this);
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

    asset(route) {
        let item = new Asset(this.$qwebs, this.$qwebs.config, route);
        this.assetTree.push(item);
        return item;
    };

    leaf(request) {
        switch (request.method) {
            case "GET":
            case "HEAD":
                return this.assetTree.findOne(request.pathname) || this.getTree.findOne(request.pathname);
            case "POST":
                return this.postTree.findOne(request.pathname);
            case "PUT":
                return this.putTree.findOne(request.pathname);
            case "DELETE":
                return this.deleteTree.findOne(request.pathname);
            case "OPTIONS":
                return this.optionsLeaf;
            default:
                throw new DataError({ message: "Method is unknown." });
        };
    };

    invoke(request, response, overridenUrl) {
        
        return Promise.resolve().then(() => {
            if(overridenUrl) request.url = overridenUrl;
            let part = url.parse(request.url);
            
            request.pathname = part.pathname;
            request.query = querystring.parse(part.query) || {};
            
            let leaf = this.leaf(request);
            if (leaf) {
                
                if (!this.$qwebs.loaded) {
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
