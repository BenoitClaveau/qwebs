/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var http = require("http"),
    Q = require("q"),
    DataError = require("./../dataerror");

function ResponseProxy($response) {
    var self = this;
    
    self.$response = $response;

    http.ServerResponse.prototype.redirect = function (url) {
        return self.$response.redirect(this, url);
    };

    http.ServerResponse.prototype.send = function (url) {
        return self.$response.send(this, url);
    };
}

ResponseProxy.prototype.constructor = ResponseProxy;

exports = module.exports = ResponseProxy;
