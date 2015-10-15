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

function Get($qwebs, route) {
    this.$qwebs = $qwebs;
    this.route = route;
    this.pathRegex = new PathRegex(this.route, false, false);
    // var part = url.parse(this.route);
    // this.pathname = part.pathname;
    this.contentType = null;
    this.serviceName = null;
    this.methodName = null;
    this.method = null;
};

Get.prototype.register = function(serviceName, methodName) {
    if (!serviceName) throw new DataError({ message: "service is not defined for " + this.route });
    if (!methodName) throw new DataError({ message: "method is not defined for " + this.route });

    this.serviceName = serviceName;
    this.methodName = methodName;

    return this;
};

Get.prototype.load = function($qwebs) {
    this.service = $qwebs.resolve(this.serviceName);
    this.method = this.service[this.methodName];
    if (!this.method) throw new DataError({ message: "Method " + this.methodName + " is not defined in " + this.serviceName + "." });
};


Get.prototype.invoke = function(request, response) {
    var self = this;
    return Q.try(function () {
        if (!self.method) throw new DataError({ message: "No method definied for " + self.route, data: self });
        if (!self.service) throw new DataError({ message: "No service definied for " + self.route, data: self });

        request.params = self.pathRegex.getParams(request.pathname);
        var promise = Q.try(function () {
            return self.service;
        });

        return self.method.call(self.service, request, response, promise);
    });
};

exports = module.exports = Get;
