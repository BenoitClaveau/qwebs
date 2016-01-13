/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var util = require('util'),
    stream = require('stream');

//new MergeStream(stream1, stream2).pipe(stream3)
var MergeStream = function() {
    var self = this;
    stream.PassThrough.call(self);
    this.sources = Array.prototype.slice.apply(arguments);
  
    self.on('pipe', function(source) {
      source.unpipe(self);
      for(var i in self.sources) {
        source = source.pipe(self.sources[i]);
      }
      self.transformStream = source;
    });
};

util.inherits(MergeStream, stream.PassThrough);

MergeStream.prototype.pipe = function(dest, options) {
  return this.transformStream.pipe(dest, options);
};

exports = module.exports = MergeStream;
