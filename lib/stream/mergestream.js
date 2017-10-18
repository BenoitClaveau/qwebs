/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";


const { PassThrough } = require('stream');

class MergeStream extends PassThrough {
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
