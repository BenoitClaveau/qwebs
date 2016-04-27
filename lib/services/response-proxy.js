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
        
        var self = this;
        http.ServerResponse.prototype.redirect = function(url) {
            return self.$response.redirect(this, url);
        };

        http.ServerResponse.prototype.send = function(url) {
            return self.$response.send(this, url);
        };
    };
};

exports = module.exports = ResponseProxy;