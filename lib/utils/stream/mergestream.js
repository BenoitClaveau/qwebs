/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var util = require('util'),
    stream = require('stream');

//new MergeStream(stream1, stream2).pipe(stream3)
var MergeStream = function(sources) { 
    var self = this;
    stream.PassThrough.call(self);
    this.sources
  
    self.on('pipe', function(source) {
      source.unpipe(self);
      for(i in self.sources) {
        source = source.pipe(self.sources[i]);
      }
      self.transformStream = source;
    });
};

util.inherits(MergeStream, stream.PassThrough);

MergeStream.prototype.pipe = function(dest, options) {
  return this.transformStream.pipe(dest, options);
};

exports = module.exports = function() {
    var sources = Array.prototype.slice.apply(arguments);
    return new MergeStream(sources)
};
