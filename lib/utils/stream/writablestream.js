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

function WritableStream () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    
    stream.Writable.call(self);
    if (args.length == 0) self.buffer = new Buffer('');
    else if (args.length == 2) self.buffer = new Buffer(args[0], args[1]);
    else if (args.length == 1) {
        if (Buffer.isBuffer(arg[0])) self.buffer = args[0];
        else self.buffer = new Buffer('', args[0]);
    }
    else throw new DataError({message: "Wrong number of arguments."});
   
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

util.inherits(WritableStream, stream.Writable);

WritableStream.prototype._write = function (chunk, enc, cb) {
    var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
    this.buffer = Buffer.concat([this.buffer, buffer]);
    cb();
};

exports = module.exports = WritableStream

