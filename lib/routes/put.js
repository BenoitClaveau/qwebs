/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Post = require("./post"),
    Q = require("q");
	
function Put($qwebs, route) {
    Post.call(this, $qwebs, route);
};

Put.prototype = Object.create(Post.prototype);
Put.prototype.constructor = Put;

exports = module.exports = Put;
