/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const DataError = require("./../dataerror");
const Node = require("./node");
const Nodes = require("./nodes");

class Tree {
    constructor() {
		this.nodes = new Nodes();
	};

	push(router) {
		if (!router) throw new DataError({ message: "Router is not defined." });
		router.route = router.route || '';
		let tokens = router.route.split("/");
		if (tokens[0] === '' && tokens.length > 1) tokens.splice(0, 1);
		let branch = this.createBranch(tokens, router);
		this.nodes.push(branch);
	};

	findOne(route) {
		route = route || '';

		let tokens = route.split("/");
		if (tokens[0] === '' && tokens.length > 1) tokens.splice(0,1);
		
		let node = this.createNode(tokens);
		let params = {};
		let result = this.nodes.findOne(node, params);
		
		if (!result) return null;
		if (!result.node) return null;
		return { 
			router: result.node.router,
			params: result.params
		};
	};

	createBranch(tokens, router) {
		if (!tokens) throw new DataError({ message: "Token is not defined." });
		if (tokens.length == 0) throw new DataError({ message: "Token is empty." });
		if (tokens.length == 1) return new Node(tokens.shift(), router);
		let node = new Node(tokens.shift(), null);
		node.nodes.push(this.createBranch(tokens, router));
		return node;
	}

	createNode(tokens) {
		if (!tokens) throw new DataError({ message: "Token is not defined." });
		if (tokens.length == 0) throw new DataError({ message: "Token is empty." });
		if (tokens.length == 1) return new Node(tokens.shift(), null);
		
		let node = new Node(tokens.shift(), null);
		node.nodes.push(this.createNode(tokens));
		return node;
	}

	load() {
		this.nodes.load();
	};
};

exports = module.exports = Tree;