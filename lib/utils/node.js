/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const PathRegex = require("./pathRegex");
const Nodes = require("./nodes");

class Node {
    constructor(token, router) {
		this.token = token;
		this.router = router;
		this.pathRegex = new PathRegex(this.token, false, false);
		this.nodes = new Nodes();
	};

	match(node) {
		if (!node.token == undefined) throw new DataError({ message: "Token is not defined.", data: { node: node }});
		return this.pathRegex.match(node.token);
	};
};

exports = module.exports = Node;