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
		console.log(item.name)
		item.load();
	});

	var repush = Math.max(10, stack.length * stack.length); 

	while(stack.length > 0 && repush > 0){
		var item = stack.shift();
		if (!item.create()) {
			repush = repush - 1; 
			stack.splice(stack.length, 0, item);
		}
	}
	if (stack.length > 0) throw new DataError({ message: "Service cannot be created.", data: stack });
};

Injector.prototype.resolve = function(name) {
	if (!name) throw new DataError({ message: "Service name is not defined.", data: {service: name}}); 
	var item = this.container[name];
	if (!item) throw new DataError({ message: "Service is not injected.", data: {service: name} });
	
	if (!item.instance) {
		item.load();
		if(!item.create()) throw new DataError({ message: "Services injected couldn't be created.", data: {service: name} });
	}
	
	if (!item.instance) throw new DataError({ message: "Service instance is not defined.", data: {service: name} });
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
		if (this.options.isClass) throw new DataError({ message: "Service cannot be an instance." , data: { service: this.name } });
		this.instance = service;
	}
	else if (typeof service == "function") this.description = service;
	else this.location = service;
};

Item.prototype.load = function() {
	if (!this.location) return;

	if (this.location[0] == " ") throw new DataError({ message: "Service name start with space." , data: { service: this.name } });
	var	object;
	if (this.options.local) object = require(this.location);
	else object = require.main.require(this.location);	//require from execution folder
	
	if (!object) throw new DataError({ message: "Node require fails to load " + this.location });
	
	if (typeof object == "object") this.instance = object;
	else if (typeof object == "function") this.description = object;
	else throw new DataError({ message: "Unknwon type of " + this.location + " " + typeof object });
};

Item.prototype.create = function() {
	if (this.instance) return true;
	if (!this.description) throw new DataError({ message: "Description is not defined.", data: { service: this.name } });
	
	
	if (this.options.isClass) {
		this.instance = this.description;
		return true;
	}
	
	var args = []
	var func = this.description;
	var deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
		
	for(var i=0; i < deps.length; i++) {	
		var d = deps[i];
		if (! d || d == "") continue; //ex function() => deps = [""] => we ignore it
		try {
			var item = this.$injector.resolve(d);
			args.push(item);
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	var proto = Object.create(func.prototype);
	func.apply(proto, args);
	this.instance = proto;
	if (!this.instance) throw new DataError({ message: "Service cannot be created.", data: { service: this.name }});
	return true;      
};

exports = module.exports = Injector;