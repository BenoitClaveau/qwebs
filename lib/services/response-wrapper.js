/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var http = require("http"),
    Q = require("q"),
    DataError = require("./../dataerror");

function ResponseWrapper($response) {
    var self = this;
    
    self.$response = $response;

    //extends http.ServerResponse
    http.ServerResponse.prototype.redirect = function (url) {
        return self.$response.redirect(this, url);
    };

    http.ServerResponse.prototype.send = function (url) {
        return self.$response.send(this, url);
    };
}

ResponseWrapper.prototype.constructor = ResponseWrapper;

exports = module.exports = ResponseWrapper;
