/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Q = require("q"),
    stream = require("stream"),
    DataError = require("./../../dataerror"),
    util = require("util");

function WritableBufferStream (buffer) {
    var self = this;
    stream.Writable.call(self);
    self.buffer = buffer;
    
    self.deferred = Q.defer();
    var promise = self.promise = self.deferred.promise;
    
    self.on("drain", function(chunk) {
        self.deferred.notify(chunk);
    });

    self.once("finish", function() {
        self.deferred.resolve(self.buffer);
    });
    
    self.on("error", function(error) {
        self.deferred.reject(new DataError({error: error}));
    });
    
    self.then = promise.then.bind(promise);
    self.catch = promise.catch.bind(promise);
    self.finally = promise.finally.bind(promise);
}

util.inherits(WritableBufferStream, stream.Writable);

WritableBufferStream.prototype._write = function (chunk, enc, cb) {
    var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
    this.buffer = Buffer.concat([this.buffer, buffer]);
    cb();
};

exports = module.exports = WritableBufferStream;