/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Post = require("./post"),
    Q = require("q");
	
function Delete($qwebs, route) {
    Post.call(this, $qwebs, route);
};

Delete.prototype = Object.create(Post.prototype);
Delete.prototype.constructor = Delete;

exports = module.exports = Delete;
