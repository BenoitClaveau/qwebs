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

const { Readable } = require('stream');

class FromArray extends Readable {
    constructor() {
        super({ objectMode : true });
    };

    get array(value) {
        let item = null;
        while(item = value.pop() !== null) {
            this.push(item);
        }
        this.push(null);
    }

};

exports = module.exports = FromArray;