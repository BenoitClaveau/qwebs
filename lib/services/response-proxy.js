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
        http.ServerResponse.prototype.redirect = function(data) {
            return self.$response.redirect(this, data);
        };

        http.ServerResponse.prototype.send = function(data) {
            return self.$response.send(this, data);
        };
    };
};

exports = module.exports = ResponseProxy;