/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

/* exemple
return stream.pipe(new ToBuffer()).then(items => {
    expect(item.length).toEqual(0);
});
*/

const stream = require("stream");

class ToBuffer extends stream.Writable {
    constructor() {
        super({ objectMode : true });
        this.data = [];
        
        this.promise = new Promise((resolve, reject) => {
            this.once("finish", () => {
                resolve(Buffer.concat(this.data));
            });
            this.once("error", reject );
        });

        this.then = this.promise.then.bind(this.promise);
        this.catch = this.promise.catch.bind(this.promise);     
    };

    _write(chunk, encoding, callback) {
        this.data.push(chunk);
        callback();
    };
};

exports = module.exports = ToBuffer;