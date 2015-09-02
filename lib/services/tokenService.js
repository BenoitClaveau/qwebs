"use strict";

var jwt = require('jwt-simple'),
    global = require('./../global');

function TokenService() {
}

TokenService.prototype = {
    identify: function (request, response) {
        var self = this;
        var token = null;

        if(request.headers.authorization) token = request.headers.authorization;
        if (!token) throw new Error('401');

        request.payload = self.decode(token);
    },
    encode: function (payload) {
        return jwt.encode(payload, global.secret);
    },
    decode: function (token) {
        return jwt.decode(token, global.secret);
    }
};

exports = module.exports = TokenService;