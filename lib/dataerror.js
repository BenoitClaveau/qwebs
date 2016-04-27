/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 "use strict";

class DataError extends Error {
    constructor(options) {
        super(options.message || "Qwebs error");
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;

        if (options.stack) {
            this.stack = options.stack;
            delete options.stack;
        }
        
        if (!options.data) this.data = [];
        else if (options.data instanceof Array) this.data = options.data;
        else this.data = [options.data];
        
        this.header = options.header || {};
        this.header["Content-Type"] = this.header["Content-Type"] || "application/json";
        this.statusCode = options.statusCode || 500;
    };
};

exports = module.exports = DataError;