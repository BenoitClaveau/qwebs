/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const DataError = require("./../dataerror");

class Options {
    constructor() {
    };

    invoke (request, response) {
        return Promise.resolve().then(() => {
            if (request.url != "*") throw new DataError({ message: "Url is not *." });
            
            let header = {
                "Allow": "GET,POST,PUT,DELETE,HEAD,OPTIONS"
            };
            
            return response.send({ request: request, statusCode: 200, header: header });
        });
    };
};

exports = module.exports = Options;