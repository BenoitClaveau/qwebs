/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const stream = require('stream');

class MergeStream extends stream.PassThrough {
    constructor() {
        this.sources = Array.prototype.slice.apply(arguments);
        this.on('pipe', (source) => {
          source.unpipe(this);
          for(let i in this.sources) {
            source = source.pipe(this.sources[i]);
          }
          this.transformStream = source;
        });
    };
    
    pipe(dest, options) {
      return this.transformStream.pipe(dest, options);
    };
};

exports = module.exports = MergeStream;
