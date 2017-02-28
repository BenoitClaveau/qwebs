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

const stream = require("stream");

class ToArray extends stream.Writable {
    constructor() {
        super({ objectMode : true });
        this._data = [];
        
        this.promise = new Promise((resolve, reject) => {
            this.once("finish", () => {
                this.onFinish(resolve, reject);
            });
            this.once("error", error => {
                this.onError(resolve, reject, error);
            });
        });

        this.then = this.promise.then.bind(this.promise);
        this.catch = this.promise.catch.bind(this.promise);     
    };

    _write(chunk, encoding, callback) {
        this._data.push(chunk);
        callback();
    };

    onFinish(resolve, reject) {
        resolve(this._data);
    };

    onError(resolve, reject, error) {
        if (error instanceof DataEror) reject(error);
        else reject(new DataError({ message: error.message, stack: error.stack }));
    };
};

exports = module.exports = ToArray;