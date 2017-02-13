/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const Leaf = require("./leaf");
const Options = require("../routes/options");

class OptionsLeaf extends Leaf {
    constructor($router) {
		super(new Options($router));
	};
};

exports = module.exports = OptionsLeaf;