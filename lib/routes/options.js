/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const DataError = require("./../dataerror");

class Options {
    constructor($router) {
        this.$router = $router;
    };

    invoke (request, response) {
        return Promise.resolve().then(() => {
            let allow = [];
            
            if (request.url == "*") allow = ["GET","POST","PUT","DELETE","HEAD","OPTIONS"];
            else {
                if (this.$router.assetTree.findOne(request.pathname) || this.$router.getTree.findOne(request.pathname)) allow.push("GET");
                if (this.$router.postTree.findOne(request.pathname)) allow.push("POST");
                if (this.$router.putTree.findOne(request.pathname)) allow.push("PUT");
                if (this.$router.deleteTree.findOne(request.pathname)) allow.push("DELETE");
            }

            let header = {
                "Allow": allow.join()
            };
            
            return response.send({ request: request, statusCode: 200, header: header });
        });
    };
};

exports = module.exports = Options;