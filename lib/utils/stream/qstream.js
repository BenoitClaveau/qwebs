/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Q = require('q'),
    DataError = require("./../../dataerror"),
    stream = require('stream'),
    util = require("util");

require('events').EventEmitter.prototype._maxListeners = 100;

function QStream (data) {
    var self = this;
    stream.Writable.call(self);
    self.data = new Buffer(data);
    self.length = 0;
    
    self.deferred = Q.defer();
    var promise = self.promise = self.deferred.promise;
    
    self.once("finish", function() {
        console.log("finish")
        var content = self.data.toString("utf8");
        self.deferred.resolve(content);
    });
    
    self.on("error", function(error) {
        self.deferred.reject(error);
    });
    
    self.then = promise.then.bind(promise);
    self.catch = promise.catch.bind(promise);
    self.finally = promise.finally.bind(promise);
}

util.inherits(QStream, stream.Writable);

QStream.prototype._write = function (chunk, enc, cb) {
    var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
    this.data = Buffer.concat([this.data, buffer]);
    
    this.length = this.data.length;

    cb();
};

exports = module.exports = QStream;

// MemoryStream.prototype._write = function (chunk, enc, cb) {
//     console.log("write")
//     this.passThrough.write(chunk, enc, cb);
// };
// 
// MemoryStream.prototype._read = function(n) {
//     var chunk;
//     console.log("read")
//     while (null !== (chunk = this.passThrough.read(n))) {
//         
//         if (!this.push(chunk)) break;
//     }
// };

// function MemoryStream () {
//     Duplex.call(this);
//     this.data = new Buffer('');
//     
//     this.offset = this.length = 0;
// }
// 
// util.inherits(MemoryStream, Duplex);
// 
// MemoryStream.prototype._write = function (chunk, enc, cb) {
//     var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
//     this.data = Buffer.concat([this.data, buffer]);
//     
//     this.length = this.data.length;
//     
//     console.log("_write", this.length)
//     
//     cb();
// };
// 
// MemoryStream.prototype._read = function(size) {
//     if (!this.length) console.log("_read empty")
//     
//     if (this.offset < this.length) {
//         console.log(this.data.toString())
//         this.push(this.data.slice(this.offset, (this.offset + size)));
//         this.offset += size;
//     }
//     else {
//         console.log("_read completed")
//         this.offset = this.length = 0;
//         this.push(null);
//     }
// };
