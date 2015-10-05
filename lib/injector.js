/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var path = require('path'),
	DataError = require("./dataerror"),
	Q = require("q");

function Injector() {
	this.container = {};
	this.plan = {};
};

Injector.prototype.inject = function(name, location, options) {
	if (!name) throw new DataError({ message: "Service name is not defined."}); 
	if (!location) throw new DataError({ message: "Service location is not defined."});

    this.container[name] = new Item(this, name, location, options);
};

Injector.prototype.load = function() {
	if (this.container.length == 0) return;
	
	var stack = [];
	
	for (var key in this.container) {
		stack.splice(stack.length, 0, this.container[key]);
	}
	
	stack.forEach(function(item) {
		item.load();
	});

	while(stack.length > 0){
		var item = stack.shift();
		item.create();
	}
};

Injector.prototype.resolve = function(name) {
	if (!name) throw new DataError({ message: "Service name is not defined." }); 
	var item = this.container[name];
	if (!item) throw new DataError({ message: "Service " + name + " is not injected." });
	
	if (!item.instance) {
		//console.log("resolve before load => trying to load module", item.name);
		item.load();
		item.create();
	}
	
	if (!item.instance) throw new DataError({ message: "Instance of " + name + " is not created." });
	return item.instance;
};

//-----------------

function Item($injector, name, service, options) {
	if (!$injector) throw new DataError({ message: "$injector is not defined."});
	if (!name) throw new DataError({ message: "Name is not defined."});
	if (!service) throw new DataError({ message: "Service is not defined."});
	
	this.$injector = $injector;
	this.name = name;
	this.options = options || {};
	this.instance = null;
	this.description = null;
	this.location = null;
	
	if (typeof service == "object") {
		if (this.options.instanciate === false) throw new DataError({ message: "Service " + this.name + " cannot be an instance." });
		this.instance = service;
	}
	else if (typeof service == "function") {
		this.description = service;
	}
	else {
		this.location = service;
	}
};

Item.prototype.load = function() {
	if (!this.location) return;

	if (this.location[0] == " ") throw new DataError({ message: "Service " + this.name + " start with space." });
	var	object;
	
	if (this.options.local) {
		object = require(this.location);
	}
	else {
		var relative = this.location[0] == ".";
		var location = this.location;
		if (relative) {
			var $qwebs = this.$injector.resolve("$qwebs");
			location = path.resolve($qwebs.root, this.location);
		}
		object = require.main.require(location);
	}
	
	if (!object) throw new DataError({ message: "Node require fails to load " + this.location + "." });
	
	if (typeof object == "object") this.instance = object;
	else if (typeof object == "function") this.description = object;
	else throw new DataError({ message: "Unknwon type of " + this.location + " " + typeof object + "." });
};

Item.prototype.create = function() {	
	if (this.instance) return true;
	if (!this.description) throw new DataError({ message: "Description of service " + this.name + "is not defined." });
	
	if (this.options.instanciate === false) {
		this.instance = this.description;
		return;
	}
	
	this.$injector.plan[this.name] = this.$injector.plan[this.name] || [];
	
	var args = []
	var func = this.description;
	var scope = Object.create(func.prototype);
	
	if (this.deps) throw new DataError({ message: "Cyclic reference of "+ this.name + " " + JSON.stringify(this.$injector.plan[this.name]) });
	
	this.deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');

	for(var i=0; i < this.deps.length; i++) {	
		var d = this.deps[i];
		if (! d || d == "") continue; //ex function() => deps = [""] => we ignore it
		
		this.$injector.plan[this.name].push(d); //add d
		
		var item = this.$injector.resolve(d);
		args.push(item);
		//scope[d] = item; //scope injection. ex this.$qwebs
	}
	
	func.apply(scope, args);
	this.instance = scope;
	if (!this.instance) throw new DataError({ message: "Service " + this.name + " cannot be created." });
};

exports = module.exports = Injector;