/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var url = require("url"),
    DataError = require("./../dataerror"),
    Q = require("q");

function Get($qwebs, route) {
    this.$qwebs = $qwebs;
    this.route = route;
    // var part = url.parse(this.route);
    // this.pathname = part.pathname;
    this.contentType = null;
    this.serviceName = null;
    this.methodName = null;
    this.method = null;
};

Get.prototype.register = function(serviceName, methodName) {
    if (!serviceName) throw new DataError({ message: "Service is not defined.", data: { route: this.route }});
    if (!methodName) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});

    this.serviceName = serviceName;
    this.methodName = methodName;

    return this;
};

Get.prototype.load = function($qwebs) {
    this.service = $qwebs.resolve(this.serviceName);
    this.method = this.service[this.methodName];
    if (!this.method) throw new DataError({ message: "Method is not defined.", data: { service: this.serviceName, method: this.method }});
};


Get.prototype.invoke = function(request, response) {
    var self = this;
    return Q.try(function () {
        if (!self.method) throw new DataError({ message: "Service is not defined.", data: { route: self.route }});
        if (!self.service) throw new DataError({ message: "Method is not defined.", data: { route: self.route }});

        var promise = Q.try(function () {
            return self.service;
        });

        return self.method.call(self.service, request, response, promise);
    });
};

exports = module.exports = Get;
