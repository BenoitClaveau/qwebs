/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const Get = require("./routes/get");
const Post = require("./routes/post");
const Delete = require("./routes/delete");
const Put = require("./routes/put");
const Patch = require("./routes/patch");
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
        this.patchTree = new Tree();
        this.assetTree = new Tree();
        this.optionsLeaf = new OptionsLeaf(this);
    };

    load() {
        this.getTree.load();
        this.postTree.load();
        this.putTree.load();
        this.patchTree.load();
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

    put(route) {
        let item = new Put(this.$qwebs, route);
        this.putTree.push(item);
        return item;
    };

    patch(route) {
        let item = new Patch(this.$qwebs, route);
        this.patchTree.push(item);
        return item;
    };

    delete(route) {
        let item = new Delete(this.$qwebs, route);
        this.deleteTree.push(item);
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
            case "PATCH":
                return this.patchTree.findOne(request.pathname);
            case "DELETE":
                return this.deleteTree.findOne(request.pathname);
            case "OPTIONS":
                return this.optionsLeaf;
            default:
                throw new DataError({ message: "Method is unknown.", data: { method: request.method }});
        };
    };

    invoke(request, response) {
        return Promise.resolve().then(() => {
            let leaf = this.leaf(request);

            if (!leaf) throw new DataError({ statusCode: 404, request: request, data: { url: request.url }});
            if (!this.$qwebs.loaded) {
                let headers = { 
                    "Content-Type": "text/html",
                    "Retry-After": 30
                };
                throw new DataError({ statusCode: 503, request: request, message: "Server is loading.", data: { url: request.url }, headers: headers });
            }

            request.params = leaf.params;
            return leaf.router.invoke(request, response);
        });
    };

    toString() {
		return `GET
${this.getTree}
POST
${this.postTree}
PUT
${this.putTree}
PATCH
${this.patchTree}
DELETE
${this.deleteTree}`;
	}
};

exports = module.exports = Router;
