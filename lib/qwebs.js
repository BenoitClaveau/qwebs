/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

require("./response"); //extend response

var url = require("url"),
    querystring = require("querystring"),
    path = require("path"),
    PathRegex = require("./pathRegex"),
    Asset = require("./asset"),
    multiparty = require("multiparty"),
    DataError = require("./dataerror"),
    assetService = require("./assetservice"),
    configService = require("./configservice"),
    bundleService = require("./bundleservice"),
    fs = require("fs"),
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
       
    return assetService.load(self.folder).then(function() {
        return bundleService.load(self.bundle).then(function(bundle) {
            var promises = [];
            for (var property in bundle) {
                var files = bundle[property];
                var newAsset = assetService.add(new Asset(property));
                promises.push(newAsset.initFromFiles(files));
            };
            return Q.all(promises);
        });
    }); 
};

Qwebs.prototype.get = function(route) {
    var item = new Get();
    item.setRoute(route);
    this.getList.push(item);
    return item;
};

Qwebs.prototype.post = function(route) {
    var item = new Post();
    item.setRoute(route);
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
        throw new DataError({ statusCode: 404, message: "Unknwon route.", url: request.url, header: header });
    });
};

Qwebs.prototype.reroute = function(url, request, response) {
    request.url = url;
    return assetService.invoke(request, response);
};

function Get(route) {
    this.route = null;
    this.pathname = null;
    this.pathRegex = null;
    this.contentType = null;
    this.controller = null;
    this.view = null;
};

Get.prototype.setRoute = function(route) {
    this.route = route;
    var part = url.parse(this.route);
    this.pathname = part.pathname;
    this.pathRegex = new PathRegex(this.route, false, false);
};

Get.prototype.register = function(controller, viewName) {
    if (!controller) throw new Error("controller is not defined for " + this.route);
    if (!viewName) throw new Error("view is not defined for " + this.route);

    this.controller = controller;
    this.view = this.controller[viewName];

    if (!this.view) throw new Error("view is not defined for " + this.route);
    return this;
};

Get.prototype.match = function(request) {
    var res = this.pathRegex.match(request.pathname);
    //console.log("pathname: " + request.pathname + " match with " + this.pathname + " -> " + res);
    return res;
};

Get.prototype.invoke = function(request, response) {
    var self = this;
    return Q.try(function () {
        if (!self.view) throw new Error("No view definied for " + self.route + " " + JSON.stringify(self));
        if (!self.controller) throw new Error("No controller definied for " + self.route + " " + JSON.stringify(self));

        request.params = self.pathRegex.params || {};
        var promise = Q.try(function () {
            return self.controller;
        });

        return self.view.call(self.controller, request, response, promise);
    });
};

//POST
function Post() {
};

Post.prototype = Object.create(Get.prototype);
Post.prototype.constructor = Post;

Post.prototype.invoke = function (request, response) {
    var self = this;

    return Q.try(function () {
        if (self.view == null) throw new Error("No view definied for get: " + self.route);

        request.params = self.pathRegex.params || {};

        var mime = "application/json";
        var contentType = request.headers["content-type"];

        if (contentType) {
            var contentTypes = contentType.split(";");
            mime = contentTypes[0];
        };

        if (mime == "multipart/form-data") {
            var uploadDir = path.resolve(__dirname, "../../../temp"); /*temp file*/
            var form = new multiparty.Form({ uploadDir: uploadDir });
            return Q.ninvoke(form, "parse").then(function (data) {
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
                //console.log("Qwebs.post(" + request.url + ") body: " + JSON.stringify(request.body));
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

exports = module.exports = new Qwebs();
