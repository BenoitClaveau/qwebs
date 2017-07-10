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
        if (this.message[this.message.length - 1] !== ".") this.message += ".";

        this.name = this.constructor.name;

        if (options.stack) this.stack = options.stack;
        if (options.fileName) this.fileName = options.fileName;
        if (options.lineNumber) this.lineNumber = options.lineNumber;
        if (options.columnNumber) this.columnNumber = options.columnNumber;
        if (options.request) this.request = options.request;
        
        if (!options.data) this.data = {};
        else if (options.data instanceof Array) this.data = { array: options.data };
        else this.data = options.data;
        
        this.headers = options.headers || {};
        this.headers["Content-Type"] = this.headers["Content-Type"] || "application/json";
        
        this.statusCode = options.statusCode || 500;
    };
    
    toString() {
        let data = [];
        data.push({key: "statusCode", value: this.statusCode });
        data.push({key: "data", value: JSON.stringify(this.data) });
        data.push({key: "headers", value: JSON.stringify(this.headers) });
        if (this.fileName) data.push({key: "fileName", value: this.fileName });
        if (this.lineNumber) data.push({key: "lineNumber", value: this.lineNumber });
        if (this.columnNumber) data.push({key: "columnNumber", value: this.columnNumber });
        data.push({key: "stack", value: this.stack });
        
        return `${this.name}: ${this.message} ${data.map(e => `
    - ${e.key}: ${e.value}`)}`
        };
}

exports = module.exports = DataError;