/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 "use strict";
var http = require("http");

class DataError extends Error {
    constructor(options) {
        super(options.message || "Qwebs error");
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;

        if (options.stack) this.stack = options.stack;
        if (options.fileName) this.fileName = options.fileName;
        if (options.lineNumber) this.lineNumber = options.lineNumber;
        if (options.columnNumber) this.columnNumber = options.columnNumber;
        if (options.request) this.request = options.request;
        
        if (!options.data) this.data = {};
        else if (options.data instanceof Array) this.data = { array: options.data };
        else this.data = options.data;
        
        this.header = options.header || {};
        this.header["Content-Type"] = this.header["Content-Type"] || "application/json";
        
        this.statusCode = options.statusCode || 500;
    };
};

exports = module.exports = DataError;