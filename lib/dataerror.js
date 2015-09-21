"use strict";

function DataError(options) {
    this.name = "DataError";
    this.message = options.message || "Qwebs error";
    this.data = options.data || [];
    this.header = options.header || {};
    this.statusCode = options.statusCode || 500;
};

DataError.prototype = Object.create(Error.prototype);
DataError.prototype.constructor = DataError;

exports = module.exports = DataError;