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

const { PassThrough } = require('stream');

class JSONStream extends PassThrough {
    constructor(opts) {
        super(opts);
        this.op = '[\n';
        this.sep = '\n,\n';
        this.cl = '\n]\n';
        this.first = true;
        this.any = false;

        this.on("finish", () => {
            if(!this.first) this.push(this.op)
            this.push(this.cl);
            stream.queue(null)
        })
    };

    _transform(chunk, encoding, callback) {

        try {
            const json = JSON.stringify(data, null, indent);
            if (first) { 
                first = false; 
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

};

exports = module.exports = JSONStream;