/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const WebError = require("./../weberror");

class StreamService {
    constructor() {
    };

    toPromise(stream) {
        throw new WebError();
    }
};

exports = module.exports = StreamService;
