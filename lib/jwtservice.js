/*!
 * qwebs-auth-jwt
 * Copyright (c) 2015 beny78
 * MIT Licensed
 */
 
"use strict";

var jwt = require('jwt-simple'),
    config = require('./config'),
    Service = require('./service');

function TokenService() {
    if (config.secret) throw new Error("secret is not defined.");
};
TokenService.prototype = Object.create(Service.prototype);
TokenService.prototype.constructor = TokenService;

TokenService.prototype.identify = function (request, response) {
    var self = this;
    var token = null;

    if(request.headers.authorization) token = request.headers.authorization;
    if (!token) throw new Error('401');

    request.payload = self.decode(token);
};

TokenService.prototype.encode = function (payload) {
    return jwt.encode(payload, config.secret);
};

TokenService.prototype.decode = function (token) {
    return jwt.decode(token, config.secret);
};

exports = module.exports = TokenService;