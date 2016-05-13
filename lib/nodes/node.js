/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const Leaf = require("./leaf");
const PathRegex = require("../utils/pathRegex");
const Nodes = require("./nodes");

class Node extends Leaf {
    constructor(token, router) {
		super(router)
		this.token = token;
		this.pathRegex = new PathRegex(this.token, false, false);
		this.nodes = new Nodes();
	};

	match(node) {
		if (!node.token == undefined) throw new DataError({ message: "Token is not defined.", data: { node: node }});
		return this.pathRegex.match(node.token);
	};
};

exports = module.exports = Node;