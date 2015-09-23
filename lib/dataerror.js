"use strict";

function DataError(options) {
    Error.call(this);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    
    this.message = options.message || "Qwebs error";
    
    if (!options.data) this.data = [];
    else if (options.data instanceof Array) this.data = options.data;
    else this.data = [options.data];
    
    this.header = options.header || {};
    this.header["Content-Type"] = this.header["Content-Type"] || "application/json";
    this.statusCode = options.statusCode || 500;
};

DataError.prototype = Object.create(Error.prototype);
DataError.prototype.constructor = DataError;

exports = module.exports = DataError;