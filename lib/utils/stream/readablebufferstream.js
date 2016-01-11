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

function ReadableBufferStream (buffer) {
    var self = this;
    stream.Readable.call(self);
    self.buffer = buffer;
    self.offset = 0;
    self.length = buffer.length;
    
    self.deferred = Q.defer();
    var promise = self.promise = self.deferred.promise;
    
    self.on("data", function(chunk) {
        self.deferred.notify(chunk);
    });

    self.once("end", function() {
        self.deferred.resolve(self.buffer);
    });
    
    self.on("error", function(error) {
        self.deferred.reject(new DataError({error: error}));
    });
    
    self.then = promise.then.bind(promise);
    self.catch = promise.catch.bind(promise);
    self.finally = promise.finally.bind(promise);
}

util.inherits(ReadableBufferStream, stream.Readable);

ReadableBufferStream.prototype._read = function(size) {
    var self = this;
    if (self.offset < self.length) {
        self.push(self.buffer.slice(self.offset, (self.offset + size)));
        self.offset += size;
    }
    else {
        self.offset = 0;
        self.push(null);
    }
};

exports = module.exports = ReadableBufferStream;