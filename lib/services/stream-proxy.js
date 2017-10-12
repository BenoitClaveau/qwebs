/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const http = require("http");
const stream = require("stream");

class StreamProxy {
    constructor($stream) {
        this.$stream = $stream;
        
        const proxy = this;
        stream.prototype.toPromise = function() {
            return proxy.$stream.toPromise(this, data);
        };

    };
};

exports = module.exports = StreamProxy;