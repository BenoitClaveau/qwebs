/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

class Options {
    constructor() {
    };

    invoke (request, response) {
        return Promise.resolve().then(() => {
            let header = {
                "Allow": "POST, GET, PUT, DELETE, OPTIONS"
            };
            return response.send({ request: request, statusCode: 200, header: header });
        });
    };
};

exports = module.exports = Options;