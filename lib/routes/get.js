/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var url = require("url"),
    PathRegex = require("./../utils/pathRegex"),
    DataError = require("./../dataerror"),
    Q = require("q");

function Get(route) {
    this.route = route;
    var part = url.parse(this.route);
    this.pathname = part.pathname;
    this.pathRegex = new PathRegex(this.route, false, false);
    this.contentType = null;
    this.controller = null;
    this.view = null;
};

Get.prototype.register = function(controller, viewName) {
    if (!controller) throw new DataError({ message: "Controller is not defined for " + this.route });
    if (!viewName) throw new DataError({ message: "View is not defined for " + this.route });

    this.controller = controller;
    this.view = this.controller[viewName];

    if (!this.view) throw new DataError({ message: "View is not defined for " + this.route });
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
        if (!self.view) throw new DataError({ message: "No view definied for " + self.route, data: self });
        if (!self.controller) throw new DataError({ message: "No controller definied for " + self.route, data: self });

        request.params = self.pathRegex.params || {};
        var promise = Q.try(function () {
            return self.controller;
        });

        return self.view.call(self.controller, request, response, promise);
    });
};

exports = module.exports = Get;
