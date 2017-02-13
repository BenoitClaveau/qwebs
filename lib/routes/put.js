/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const Post = require("./post");

class Put extends Post {
    constructor($qwebs, route) {
        super($qwebs, route);
    };
};

exports = module.exports = Put;
