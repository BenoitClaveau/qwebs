/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

class Lock {
    constructor() {
        this.completed = false;
        this.error = null;
        this.data = null;
    };
    wait() {
        if (!this.completed)
            setTimeout(this.wait.bind(this), 100);
        if (this.error)
            throw new DataError({ message: error.message, stack: error.stack });
        return this.data;
    };
    resolve(data) {
        this.data = data;
        this.completed = true;
    };
    reject(error) {
        this.error = error;
        this.completed = true;
    };
};

exports = module.exports = Lock;