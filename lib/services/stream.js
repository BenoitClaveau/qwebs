/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class StreamService {
    constructor() {
    };

    toPromise(stream) {
        throw new Error("Not implemented.");
    }
};

exports = module.exports = StreamService;
