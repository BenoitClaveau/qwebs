/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const path = require('path');
const WebError = require("./WebError");
const StringUtils = require("./utils/string");

class Injector {
    constructor() {
		this.container = {};
		this.plan = {};
	};

	inject(name, location, options) {
		if (!name) throw new WebError({ message: "Service name is not defined."}); 
		if (!location) throw new WebError({ message: "Service location is not defined."});
		
		var item = new Item(this, name, location, options);

		if (name in this.container) {
			var old = this.container[name];
			this.container[name] = item;
			this.resolve("$qwebs").onInjectorChanged({ current: item, previous: old }); //replace service;
		}
		else this.container[name] = item;
	};

	load() {
		if (this.container.length == 0) return;
		let stack = Object.entries(this.container).map(([k, v]) => {
			v.load();		//call require
			return v;
		});

		while(stack.length > 0) {
			let item = stack.shift();
			item.create();	//call constructor
		}
	};

	resolve(name, options) {
		if (!name) throw new WebError({ message: "Service is not defined.", data: { name: name }});
		options = options || {};

		let item = this.container[name];
		if (!item) { //Trying with dash name ex: myService (in constructor arguments) will become my-service
			let dashName = StringUtils.camelCaseToDash(name); 
			item = this.container[dashName];
		}
		
		if (!item) throw new WebError({ message: "Service is not injected.", data: { name: name }});

		if (!item.instance || options.reload) {
			item.load();
			item.create();
		}
		if (!item.instance) throw new WebError({ message: "Instance is not created.", data: { name: name }});
		return item.instance;
	};

	toString() {
		let keys = Object.keys(this.container);
		return `services: ${keys.map(e => `
  ?? ${this.container[e]}`)}`;
	}
};

class Item {
	constructor($injector, name, service, options) {
		if (!$injector) throw new WebError({ message: "$injector is not defined."});
		if (!name) throw new WebError({ message: "Name is not defined."});
		if (!service) throw new WebError({ message: "Service is not defined."});
		
		this.$injector = $injector;
		this.name = name;
		this.options = options || {};
		this.instance = null;
		this.description = null;
		this.location = null;
		this.deps = null;

		if (typeof service == "object") {
			if (this.options.instanciate === false) throw new WebError({ message: "Service cannot be an instance.", data: { name: this.name }});
			this.instance = service;
		}
		else if (typeof service == "function") {
			this.description = service;
		}
		else {
			this.location = service;
		}
	};

	load() {
		if (!this.location) return;

		if (this.location[0] == " ") throw new WebError({ message: "Service location start with space.", data: { name: this.name }});
		let	object;

		let relative = this.location[0] == ".";
		let location = this.location;
		if (relative && !this.options.local) {
			const $qwebs = this.$injector.resolve("$qwebs");
			location = path.resolve($qwebs.root, this.location);
		}
		try {
			object = require(location);
		}
		catch(error) {
			throw new WebError({ message: "Error on require.", data: { message: error.message,  name: this.name, location: this.location }, stack: error.stack });
		}		
		if (typeof object == "object") this.instance = object;
		else if (typeof object == "function") this.description = object;
		else throw new WebError({ message: "Unknwon type.", data: { location: this.location }});
	};

	create() {	
		if (this.instance) return true;
		if (!this.description) throw new WebError({ message: "Description of service is not defined.", data: { name: this.name }});
		
		if (this.options.instanciate === false) {
			this.instance = this.description;
			return;
		}
		
		this.$injector.plan[this.name] = this.$injector.plan[this.name] || [];
		
		let args = []
		let fn = this.description;
		
		if (this.deps) throw new WebError({ message: "Cyclic reference.", data: { name: this.name, plan: this.$injector.plan[this.name] }});
		
		try {
			let constructor = Function.prototype.toString.call(fn).match(/constructor\s?\([\s\S]*?\)/); //search constructor
			if (constructor) {
				let tokens = constructor[0].match(/^[^\(]*\(\s*([^\)]*)\)/m); //parse constructor arguments
				this.deps = tokens[1].replace(/ /g, '').split(',');
			}
			else {
				this.deps = [];
			}
		}
		catch(error) {
			throw new WebError({ message: "No constructor found.", data: { name: this.name, fn: Function.prototype.toString.call(fn) }, stack: error.stack });
		}
		
		for (let i=0; i < this.deps.length; i++) {	
			let d = this.deps[i];
			if (!d || d == "") continue; //ex deps = [""] => we ignore it 
			
			this.$injector.plan[this.name].push(d); //add dependency in plan
			let item = this.$injector.resolve(d);
			args.push(item);
		}

		let scope = Object.create(fn.prototype);
		this.instance = new (Function.prototype.bind.apply(fn, [null].concat(args)));
		if (!this.instance) throw new WebError({ message: "Service cannot be created.", data: { name: this.name }});
	};

	toString() {
		if (this.location) return `${this.name} ${this.location}`;
		if (this.instance) return `${this.name} ${this.instance.constructor.name}`;
		return `${this.name}`;
	}
};

exports = module.exports = Injector;