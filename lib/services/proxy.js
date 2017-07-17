/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const DataError = require("./../dataerror");
const r = require("request");

class ProxyService {
    constructor($config) {
        this.$config = $config;
    };

    proxyhost(request) {
        if (!request) throw new DataError({ message: "Request is not defined."});
        if (!this.$config.proxy) return null;
        if (!this.$config.proxy.hosts) return null;
        if (!request.headers) return null;
        if (!request.headers.host) return null;
        return this.$config.proxy.hosts[request.headers.host];
    }

    invoke(request, response) {
        if (!request) throw new DataError({ message: "Request is not defined."});
        if (!response) throw new DataError({ message: "Response is not defined."});

        let host = this.proxyhost(request);
        if (!host) return false;
        if (!host.target) return false;

        let target = host.target;
        if (request.url && request.url !== "/") target += request.url;
        request.pipe(r(target)).pipe(response);
        return true;
    }

};

exports = module.exports = ProxyService;
