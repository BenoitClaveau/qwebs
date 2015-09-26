/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Get = require("./get"),
    Q = require("q");
	
function Delete(route) {
    Get.call(this, route);
};

Delete.prototype = Object.create(Get.prototype);
Delete.prototype.constructor = Delete;

exports = module.exports = Delete;
