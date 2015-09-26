/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Get = require("./get"),
    Q = require("q");
	
function Put(route) {
    Get.call(this, route);
};

Put.prototype = Object.create(Get.prototype);
Put.prototype.constructor = Put;

exports = module.exports = Put;
