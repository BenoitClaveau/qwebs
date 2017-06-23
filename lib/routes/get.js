/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const url = require("url");
const DataError = require("../dataerror");
const querystring = require("querystring");

class Get {
    constructor($qwebs, route) {
        this.$qwebs = $qwebs;
        this.route = route;
        this.contentType = null;
        this.serviceName = null;
        this.methodName = null;
        this.method = null;
    };

    register(serviceName, methodName) {
        if (!serviceName) throw new DataError({ message: "Service is not defined.", data: { route: this.route }});
        if (!methodName) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});

        if (typeof serviceName == "string") this.serviceName = serviceName;
        else this.service = serviceName;

        if (typeof methodName == "string") this.methodName = methodName;
        else this.servimethodce = methodName;

        return this;
    };

    load() {
        if (this.serviceName) this.service = this.$qwebs.resolve(this.serviceName);
        if (this.methodName) this.method = this.service[this.methodName];
        if (!this.method) throw new DataError({ message: "Method is not defined.", data: { service: this.serviceName, method: this.methodName }});
    };

    invoke (request, response) {
        return Promise.resolve().then(() => {
            if (!this.service) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});
            
            //In the future we could use decorator like @query({ skip: Number, date: { type: Date, format: 'DD/MM/YYYY' }}) ....
            //service could be null
            request.query = querystring.parse(request.part.query) || {};
            
            return this.method.call(this.service, request, response);
        });
    };
};

exports = module.exports = Get;