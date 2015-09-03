/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

require('./response'); //extend response

var url = require('url'),
    querystring = require('querystring'),
    path = require('path'),
    PathRegex = require('./pathRegex'),
    config = require('./config'),
    assets = require('./assets'),
    Asset = require('./asset'),
    multiparty = require('multiparty'),    
    Q = require('q'); 

function Router () {
    this.getList = [];
    this.postList = [];
    this.assets = assets;
    this.contentType = require('./contentType');
};

Router.prototype = {
    init: function (options) {
        var self = this;
        return Q.try(function () {
            if (options.folder) config.folder = options.folder;
            if (options.debug !== null) config.debug = options.debug;
            if (options.verbose !== null) config.verbose = options.verbose;
            
            return assets.load(config.folder).then(function () {  //load & create assets
                return self.createBundles(options);               //load and create bundle
            });
        });
    },
    createBundles: function (options) {
        var self = this;
        return Q.try(function () {
            var promises = [];
            for (var property in options.bundles) {
                var files = options.bundles[property];
                var newAsset = self.assets.add(new Asset(property));
                promises.push(newAsset.initFromFiles(files));
            }
            return promises;
        }).then(function (promises) {
            return Q.all(promises);
        });
    },
    get: function (route) {
        var item = new Get();
        item.setRoute(route);
        this.getList.push(item);
        return item;
    },
    post: function (route) {
        var item = new Post();
        item.setRoute(route);
        this.postList.push(item);
        return item;
    },
    invoke: function (request, response) {
        var self = this;
        return Q.try(function () {
            var part = url.parse(request.url);
            request.pathname = part.pathname;
            request.query = querystring.parse(part.query) || {};

            if (request.method === 'GET') {
                if (assets.match(request)) {
                    return assets.invoke(request, response);
                }
                for (var i = 0, length = self.getList.length; i < length; i++) {

                    if (self.getList[i].match(request)) {
                        return self.getList[i].invoke(request, response);
                    }
                }
            }

            if (request.method === 'POST') {
                for (var i = 0, length = self.postList.length; i < length; i++) {
                    if (self.postList[i].match(request)) {
                        return self.postList[i].invoke(request, response);
                    }
                }
            }

            throw new Error("404. Unknwon route: " + request.url + " " + request.method);
        });
    }
};

function Get(route) {
    this.route = null;
    this.pathname = null;
    this.pathRegex = null;
    this.contentType = null;
    this.controller = null;
    this.view = null;
};

Get.prototype = {
    setRoute: function (route) {
        this.route = route;
        var part = url.parse(this.route);
        this.pathname = part.pathname;
        this.pathRegex = new PathRegex(this.route);
    },
    register: function (controller, viewName) {
        if (!controller) throw new Error("controller is not defined for " + this.route);
        if (!viewName) throw new Error("view is not defined for " + this.route);

        this.controller = controller;
        this.view = this.controller[viewName];

        if (!this.view) throw new Error("view is not defined for " + this.route);
        if (config.verbose) console.log(this.route, viewName);
        return this;
    },
    match: function (request) {
        var res = this.pathRegex.match(request.pathname);
        //console.log("pathname: " + request.pathname + " match with " + this.pathname + " -> " + res);
        return res;
    },
    invoke: function (request, response) {
        var self = this;
        return Q.try(function () {
            if (!self.view) throw new Error('No view definied for ' + self.route + " " + JSON.stringify(self));
            if (!self.controller) throw new Error('No controller definied for ' + self.route + " " + JSON.stringify(self));

            request.params = self.pathRegex.params || {};
            var promise = Q.try(function () {
                return self.controller;
            });

            return self.view.call(self.controller, request, response, promise);
        });
    }
};

function Post() {
};
Post.prototype = new Get();
Post.prototype.constructor = Post;
Post.prototype.invoke = function (request, response) {
    var self = this;

    return Q.try(function () {
        if (self.view == null) throw new Error('No view definied for get: ' + self.route);

        request.params = self.pathRegex.params || {};

        var mime = "application/json";
        var contentType = request.headers["content-type"];

        //console.log(JSON.stringify(request.headers));
        if (contentType) {
            var contentTypes = contentType.split(";");
            mime = contentTypes[0];
        };

        if (mime == "multipart/form-data") {
            var uploadDir = path.resolve(__dirname, "../../../temp"); /*temp file*/
            var form = new multiparty.Form({ uploadDir: uploadDir });
            return Q.ninvoke(form, 'parse').then(function (data) {
                if (data === "") request.body = {};
                else request.body = data;
            });
        }
        else if (mime == "application/json") {
            return self.readBody(request, response).then(function (data) {
                if (data === "") request.body = {};
                else request.body = JSON.parse(data);
            });
        }
        else if (mime == "application/x-www-form-urlencoded") {
            return self.readBody(request, response).then(function (data) {
                if (data === "") request.body = {};
                else request.body = querystring.parse(data);
                //console.log("router.post(" + request.url + ") body: " + JSON.stringify(request.body));
            });
        }
        else throw new Error(mime + " is not supported.");

    }).then(function () {
        var promise = Q.try(function () {
            return self.controller;
        });

        return self.view.call(self.controller, request, response, promise);
    });

};
Post.prototype.readBody = function (request, response) {
    var data = "";

    var deferred = Q.defer();
    request.on("data", function (chunk) {
        data += chunk;
    });

    request.on("end", function () {
        deferred.resolve(data);
    });

    return deferred.promise;
};

exports = module.exports = new Router();
