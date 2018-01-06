/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

const { Readable } = require('stream');

class FromArray extends Readable {
    constructor(array) {
        super({ objectMode : true });
        this.array = array;
    };

    set array(value) {
        this.items = value;
    }

    _read(size) {
        const item = this.items.pop();
        this.push(item ? item : null);
    }
};

exports = module.exports = FromArray;