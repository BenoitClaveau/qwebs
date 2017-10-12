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

const ToArray = require("./toarray");

class ToBuffer extends ToArray {
    constructor() {
        super();
    };

    onFinish(resolve, reject) {
        resolve(Buffer.concat(this._data));
    };
};

exports = module.exports = ToBuffer;