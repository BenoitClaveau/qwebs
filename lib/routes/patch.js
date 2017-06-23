/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const Post = require("./post");

class Patch extends Post {
    constructor($qwebs, route) {
        super($qwebs, route);
    };
};

exports = module.exports = Patch;
