/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const path = require('path');
const DataError = require("./dataerror");

class Injector {
    constructor() {
		this.container = {};
		this.plan = {};
	};

	inject(name, location, options) {
		if (!name) throw new DataError({ message: "Service name is not defined."}); 
		if (!location) throw new DataError({ message: "Service location is not defined."});

		this.container[name] = new Item(this, name, location, options);
	};

	load() {
		if (this.container.length == 0) return;
		let stack = [];
		for (let key in this.container) {
			stack.splice(stack.length, 0, this.container[key]);
		}
		for (let i in stack) {
			stack[i].load();
		}
		while(stack.length > 0) {
			let item = stack.shift();
			item.create();
		}
	};

	resolve(name) {
		if (!name) throw new DataError({ message: "Service name is not defined." }); 
		let item = this.container[name];
		
		if (!item) throw new DataError({ message: "Service is not injected.", data: { name: this.name }});

		if (!item.instance) {
			item.load();
			item.create();
		}
		if (!item.instance) throw new DataError({ message: "Instance is not created.", data: { name: this.name }});
		return item.instance;
	};
};

class Item {
	constructor($injector, name, service, options) {
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
			if (this.options.instanciate === false) throw new DataError({ message: "Service cannot be an instance.", data: { name: this.name }});
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

		if (this.location[0] == " ") throw new DataError({ message: "Service location start with space.", data: { name: this.name }});
		let	object;
		
		if (this.options.local) {
			try {
				object = require(this.location);
			}
			catch(error) {
				throw new DataError({ message: "Error on require.", data: { message: error.message, location: this.location }, stack: error.stack });
			}
		}
		else {
			let relative = this.location[0] == ".";
			let location = this.location;
			if (relative) {
				let $qwebs = this.$injector.resolve("$qwebs");
				location = path.resolve($qwebs.root, this.location);
			}
			try {
				object = require.main.require(location);
			}
			catch(error) {
				throw new DataError({ message: "Error on require.", data: { message: error.message, location: this.location }, stack: error.stack });
			}
		}
		
		if (!object) throw new DataError({ message: "Node require fails to load.", data: { location: this.location }});
		
		if (typeof object == "object") this.instance = object;
		else if (typeof object == "function") this.description = object;
		else throw new DataError({ message: "Unknwon type.", data: { location: this.location }});
	};

	create() {	
		if (this.instance) return true;
		if (!this.description) throw new DataError({ message: "Description of service is not defined.", data: { name: this.name }});
		
		if (this.options.instanciate === false) {
			this.instance = this.description;
			return;
		}
		
		this.$injector.plan[this.name] = this.$injector.plan[this.name] || [];
		
		let args = []
		let fn = this.description;
		
		
		if (this.deps) throw new DataError({ message: "Cyclic reference.", data: { name: this.name, plan: this.$injector.plan[this.name] }});
		
		let tokens = [];
		try {
			tokens = Function.prototype.toString.call(fn)	//default toString
						.match(/constructor\s?\([\s\S]*?\)/)[0]
						.match(/^[^\(]*\(\s*([^\)]*)\)/m);
		}
		catch(error) {
			throw new DataError({ message: "No constructor found.", data: { name: this.name, fn: Function.prototype.toString.call(fn) }, stack: error.stack });
		}
		
		this.deps = tokens[1].replace(/ /g, '').split(',');
		
		for (let i=0; i < this.deps.length; i++) {	
			let d = this.deps[i];
			if (! d || d == "") continue; //ex deps = [""] => we ignore it
			
			this.$injector.plan[this.name].push(d); //add d
			
			let item = this.$injector.resolve(d);
			args.push(item);
		}

		let scope = Object.create(fn.prototype);
		this.instance = new (Function.prototype.bind.apply(fn, [null].concat(args)));
		if (!this.instance) throw new DataError({ message: "Service cannot be created.", data: { name: this.name }});
	};
};


exports = module.exports = Injector;