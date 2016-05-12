/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const Get = require("./get");

class Delete extends Get {
    constructor($qwebs, route) {
        super($qwebs, route);
    };
};

exports = module.exports = Delete;