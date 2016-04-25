/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const http = require("http");

class ResponseProxy {
    constructor($response) {
        this.$response = $response;

        http.ServerResponse.prototype.redirect = (url) => {
            return this.$response.redirect(this, url);
        };

        http.ServerResponse.prototype.send = (url) => {
            return this.$response.send(this, url);
        };
    };
};

exports = module.exports = ResponseProxy;