/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

/* exemple
return stream.pipe(new ToArray()).then(items => {
    expect(item.length).toEqual(0);
});
*/

const { Transform } = require('stream');

class JSONStream extends Transform {
    constructor(opts) {
        super({ ...opts, objectMode: true });
        this.op = '[';
        this.sep = ',';
        this.cl = ']';
        this.ident = 4;
        this.first = true;
        this.any = false;
    };

    _transform(chunk, encoding, callback) {

        try {
            const json = JSON.stringify(chunk, null, this.ident);
            if (this.first) { 
                this.first = false; 
                this.push(this.op)
                this.push(json);
                callback();
            }
            else {
                this.push(this.sep)
                this.push(json);
                callback();
            }
        } 
        catch (error) {
            callback(error);
        }
    }

    _flush(callback) {
        if(this.first) this.push(this.op)
        this.push(this.cl);
        callback();
      };

};

exports = module.exports = JSONStream;