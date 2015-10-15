/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var DataError = require("./../dataerror"),
	PathRegex = require("./pathRegex");

function Nodes() {
	this._nodes = [];
};

Nodes.prototype.forEach = function(callback) {
	this._nodes.forEach(callback);
};

Nodes.prototype.next = function(callback) {
	if (this._nodes.length == 0) return null;
	if (this._nodes.length > 1) throw new DataError({ message: "Mutliple children." });
	return this._nodes[0];
};

Nodes.prototype.isEmpty = function() {
	return this._nodes.length == 0;
};

Nodes.prototype.push = function(node) {
	if (!node) throw new DataError({ message: "Node is not defined." });
	if (!node.token == undefined) throw new DataError({ message: "token is not defined." });
	var self = this;
	
	var existingNode = self.findByToken(node);
	if (!existingNode) {
		if (node.token[0] == ":") self._nodes.push(node); //not priority
		else self._nodes.splice(-1, 0, node);
	}
	else {
		if (node.nodes.isEmpty()) return;
		node.nodes.forEach(function(newNode) {
			existingNode.nodes.push(newNode);
		});
	}
};

Nodes.prototype.findByToken = function(node) {
	var results = this._nodes.filter(function(item) {
		return item.token === node.token;
	});
	if (results.length == 0) return null;
	if (results.length == 1) return results[0];
	throw new DataError({ message: "Multiple token."});
}

Nodes.prototype.findOne = function(node) {
	var results = this._nodes.filter(function(item) {
		return item.matchNode(node);
	});
	
	if (results.length == 0) return null;
	
	var next = node.nodes.next();
	
	for(var i = 0; i < results.length; i++)
	{
		var result = results[i];
		if (!next) {
			if(result.nodes.isEmpty()) return result;
			else continue;
		}
		else {
			var item = result.nodes.findOne(next);
			if (item) return item;
		}
	}
	
	return null;
};

Nodes.prototype.forEachRouter = function(callback) {
	var self = this;
	
	this.forEach(function(node) {
		if (node.router) callback.call(self, node.router);
		if (!node.nodes.isEmpty()) node.nodes.forEachRouter(callback);
	});
};

Nodes.prototype.trace = function(indent) {
	indent = indent || 0
	
	if(indent == 0) console.log("-- TRACE --");
	this.forEach(function(item) {
		var spaces = new Array(indent + 1).join(' ');
		console.log(spaces + item.token);
		item.nodes.trace(indent + 4);
	})
	if(indent == 0) console.log("---------");
};

//----------------

function Tree() {
	this.nodes = new Nodes();
};

Tree.prototype = Object.create(Node.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.push = function(router) {
	var tokens = router.route.split("/");
	if (tokens[0] === '' && tokens.length > 1) tokens.splice(0,1);

	var branch = this.createBranch(tokens, router);
	this.nodes.push(branch);	
};

Tree.prototype.findOne = function(route) {
	var tokens = route.split("/");
	if (tokens[0] === '' && tokens.length > 1) tokens.splice(0,1);
	
	var node = this.createNode(tokens);
	var result = this.nodes.findOne(node);
	if (!result) return null;
	return result.router;
};

Tree.prototype.createBranch = function(tokens, router) {
	if (!tokens) throw new DataError({ message: "token is not defined." });
	if (tokens.length == 0) throw new DataError({ message: "token is empty." });
	if (tokens.length == 1) return new Leaf(tokens.shift(), router);
	
	var node = new Node(tokens.shift());
	node.nodes.push(this.createBranch(tokens, router));
	return node;
}

Tree.prototype.createNode = function(tokens) {
	if (!tokens) throw new DataError({ message: "token is not defined." });
	if (tokens.length == 0) throw new DataError({ message: "token is empty." });
	if (tokens.length == 1) return new Node(tokens.shift());
	
	var node = new Node(tokens.shift());
	node.nodes.push(this.createNode(tokens));
	return node;
}

Tree.prototype.forEachRouter = function(callback) {
	this.nodes.forEachRouter(callback);
};

//----------------

function Node(token) {
	this.token = token;
	this.pathRegex = new PathRegex(this.token, false, false);
	this.nodes = new Nodes();
};

Node.prototype.matchNode = function(node) {
	if (!node.token == undefined) throw new DataError({ message: "Token is not defined." });
	
    var res = this.pathRegex.match(node.token);
    //console.log("match: " + node.token + " with " + this.token + " -> " + res);
    return res;
};

//----------------

function Leaf(token, router) {
    Node.call(this, token);
	this.router = router;
};

Leaf.prototype = Object.create(Node.prototype);
Leaf.prototype.constructor = Leaf;

exports = module.exports = Tree;