/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const request = require('request');
const DataError = require("./../dataerror");
const request = require("request");

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

    match(request, response) {
        let host = this.proxyhost(request);
        if (host && host.target) return true;
        return false;
    }

    forward(request, response) {
        let host = this.proxyhost(request);
        let target = host.target;
        if (host.port) target += ":" + port;
        
        request.pipe(request(`${host.target}/${request.url}`)).pipe(response);
    }

};

exports = module.exports = ProxyService;
