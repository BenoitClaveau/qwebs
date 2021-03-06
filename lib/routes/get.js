/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const url = require("url");
const DataError = require("../dataerror");

class Get {
    constructor($qwebs, route) {
        this.$qwebs = $qwebs;
        this.route = route;
        this.contentType = null;
        this.serviceName = null;
        this.methodName = null;
        this.method = null;
        this.options = {};
    };

    register(serviceName, methodName, options) {
        if (!serviceName) throw new DataError({ message: "Service is not defined.", data: { route: this.route }});
        if (!methodName) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});

        if (typeof serviceName == "string") this.serviceName = serviceName;
        else this.service = serviceName;

        if (typeof methodName == "string") this.methodName = methodName;
        else this.servimethodce = methodName;

        this.options = Object.assign(this.options, options);
        return this;
    };

    load() {
        if (this.serviceName) this.service = this.$qwebs.resolve(this.serviceName);
        if (this.methodName) this.method = this.service[this.methodName];
        if (!this.method) throw new DataError({ message: "Method is not defined.", data: { service: this.serviceName, method: this.methodName }});
    };

    invoke (request, response) {
        return Promise.resolve().then(() => {
            if (!this.method) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});
            return this.method.call(this.service, request, response);
        });
    };
};

exports = module.exports = Get;