/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const DataError = require("./../dataerror");
const core = require("../utils/core");

class Nodes {
    constructor() {
		this._items = [];
	};

	first() {
		if (this._items.length == 0) return null;
		if (this._items.length > 1) throw new DataError({ message: "Mutliple children." });
		return this._items[0];
	};

	push(node) {
		
		if (!node) throw new DataError({ message: "Node is not defined." });
		if (!node.token == undefined) throw new DataError({ message: "Token is not defined." });
		
		let existingNode = this.findByToken(node);
		if (!existingNode) {
			if (node.token.includes("*")) this._items.push(node);       //not prioritary
			else if (node.token.includes(":")) this._items.push(node);  //not prioritary. TODO find position of '*' and insert before his position
			else this._items.splice(-1, 0, node);                       //insert like first element
		}
		else {
			if (node.router) { //node could be a leaf
				if (existingNode.router) throw new DataError({ message: "Multiple end route.", data: { first: existingNode.router.route, second: node.router.route }});
				existingNode.router = node.router;
			}

			let count = node.nodes._items.length;
			for (let i = 0; i < count; i++) {
				existingNode.nodes.push(node.nodes._items[i]);
			}
		}
	};

	findByToken(node) {
		let results = this._items.filter(item => {
			return item.token === node.token;
		});
		if (results.length == 0) return null;
		if (results.length == 1) return results[0];
		throw new DataError({ message: "Multiple token.", data: { tokens: results }});
	}

	findOne(node) {
		let results = this._items.reduce((previous, current) => {
			let r = current.match(node);
			if (!r.match) return previous;
			previous.push({
				params: r.params,
				node: current
			});
			return previous;
		}, []);
		
		if (results.length == 0) return null;
		
		let first = node.nodes.first();
		let count = results.length;
		for (let i = 0; i < count; i++) {
			let result = results[i];
			if (!first) {
				if (result.node.router) {
					core.extend(result.params, result.params);
					return result;
				}
				else continue;
			}
			else {
				let item = result.node.nodes.findOne(first);
				if (item) {
					core.extend(item.params, result.params);
					return item;
				}
			}
		}
		
		return null;
	};

	load() {
		let count = this._items.length;
		for (let i = 0; i < count; i++) {
			let node = this._items[i];
			if (node.router) node.router.load();
			node.nodes.load();
		}
	};

	// trace(indent) {
	// 	indent = indent || 0
		
	// 	if(indent == 0) console.log("-- TRACE --");
		
	// 	let count = this._items.length;
	// 	for (let i = 0; i < count; i++) {
	// 		let item = this._items[i];
	// 		let spaces = new Array(indent + 1).join(' ');
	// 		console.log(spaces + item.token);
	// 		item.nodes.trace(indent + 4);
	// 	};
	// 	if(indent == 0) console.log("---------");
	// };
};

exports = module.exports = Nodes;