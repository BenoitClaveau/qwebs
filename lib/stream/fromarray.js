/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

const { Readable } = require('stream');

class FromArray extends Readable {
    constructor() {
        super({ objectMode : true });
    };

    set array(value) {
        let item = null;
        while(item = value.pop()) {
            this.push(item);
            console.log(value.length)
        }
        this.push(null);
    }

};

exports = module.exports = FromArray;