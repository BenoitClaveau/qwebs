/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";



var DataError = require("./../dataerror"),
	PathRegex = require("./pathRegex"),
	core = require("./core");

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
		if(node.router) { //node could be a leaf
			if (existingNode.router) throw new DataError({ message: "Multiple end route." });
			existingNode.router = node.router;
		}
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
	var results = this._nodes.reduce(function (previous, current) {
		var r = current.match(node);
		if (!r.match) return previous;
		previous.push({
			params: r.params,
			node: current
		});
		return previous;
	}, []);
	
	if (results.length == 0) return null;
	
	var next = node.nodes.next();
	
	for(var i = 0; i < results.length; i++)
	{
		var result = results[i];
		if (!next) {
			if(result.node.router) {
				core.extend(result.params, result.params);
				return result;
			}
			else continue;
		}
		else {
			var item = result.node.nodes.findOne(next);
			if (item) {
				core.extend(item.params, result.params);
				return item;
			}
		}
	}
	
	return null;
};

Nodes.prototype.forEachRouter = function(callback) {
	var self = this;
	
	this.forEach(function(node) {
		if (node.router) callback.call(self, node.router);
		node.nodes.forEachRouter(callback);
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
	var params = {};
	var result = this.nodes.findOne(node, params);
	
	if (!result) return null;
	if (!result.node) return null;
	return { 
		router: result.node.router,
		params: result.params
	};
};

Tree.prototype.createBranch = function(tokens, router) {
	if (!tokens) throw new DataError({ message: "token is not defined." });
	if (tokens.length == 0) throw new DataError({ message: "token is empty." });
	if (tokens.length == 1) return new Node(tokens.shift(), router);
	
	var node = new Node(tokens.shift(), null);
	node.nodes.push(this.createBranch(tokens, router));
	return node;
}

Tree.prototype.createNode = function(tokens) {
	if (!tokens) throw new DataError({ message: "token is not defined." });
	if (tokens.length == 0) throw new DataError({ message: "token is empty." });
	if (tokens.length == 1) return new Node(tokens.shift(), null);
	
	var node = new Node(tokens.shift(), null);
	node.nodes.push(this.createNode(tokens));
	return node;
}

Tree.prototype.forEachRouter = function(callback) {
	this.nodes.forEachRouter(callback);
};

//----------------

function Node(token, router) {
	this.token = token;
	this.pathRegex = new PathRegex(this.token, false, false);
	this.nodes = new Nodes();
	this.router = router;
};

Node.prototype.match = function(node) {
	if (!node.token == undefined) throw new DataError({ message: "Token is not defined." });
	
    return this.pathRegex.match(node.token);
};

exports = module.exports = Tree;