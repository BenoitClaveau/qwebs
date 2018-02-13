/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const path = require('path');
const { Error, UndefinedError } = require("oups");
const JsParser = require("./utils/js-parser");
const chalk = require('chalk');
const uuid = require('uuid/v4');
const EventEmitter = require('events');
const { remove } = require('diacritics');

class Injector extends EventEmitter {
    constructor() {
		super();
		this.container = {};
		this.plan = {};
	};

	inject(name, location, options = {}) {
		if (!name) throw new UndefinedError("Service name"); 
		if (!location) throw new UndefinedError("Service location");
		
		const item = new Item(this, name, location, options);
		if (name in this.container) {
			if (/false/i.test(options.replace)) return item; 
			
			const old = this.container[name];
			this.emit("inject", (old, item));
			this.container[name] = item;
		}
		else this.container[name] = item;
		return item;
	};

	constains(name) {
		return name in this.container;
	}

	get entries() {
		return Object.entries(this.container).map(([k, v]) => { return { name: k, service: v}});
	}

	async load() {
		const entries = this.entries; //create a copy
		for (let e of entries)
			await e.service.import();
	
		for (let e of entries)
			await e.service.create();

		for (let e of entries)
			await e.service.mount();
	};

	async unload() {
		const entries = this.entries; //create a copy
		for (let e of entries)
			await e.service.unmount();
	};

	async resolve(name, options = {}) {
		if (!name) throw new UndefinedError("Service name", { name: name });

		let item = this.container[name];

		if (!item) { //Trying with dash name ex: myService (in constructor arguments) will become my-service
			let dashName = name.camelCaseToDash(); 
			item = this.container[dashName];
			if (!item) { //Trying without diacritics
				const list = Object.entries(this.container).reduce((previous, [k, v]) => { 
					previous[remove(k)] = v;
					return previous;
				}, {})
				return list[dashName];
			}
		}
		
		if (!item) throw new Error("Service ${name} has not been injected.", { name: name });
		if (item.instance && !options.reload) return item.instance;
		
		await item.unmount();
		await item.import();
		await item.create();
		await item.mount();
		return item.instance;
	};

	toString() {
		let keys = Object.keys(this.container);
		return `services: ${keys.map(e => `
  ?? ${this.container[e]}`)}`;
	}
};

class Item {

	constructor($injector, name, service, options = {}) {
		if (!$injector) throw new UndefinedError("$injector");
		if (!name) throw new UndefinedError("Name");
		if (!service) throw new UndefinedError("Service");
		
		this.injector = $injector;
		this.name = name;
		this.options = options;
		this.instance = null;
		this.description = null;
		this.location = null;
		this.deps = null;
		this.mounted = false;
		this.uuid = uuid();

		if (typeof service == "object") {
			if (this.options.instanciate === false) throw new Error("Service ${service} can't be instanciate.", { service: this.name });
			this.instance = service;
		}
		else if (typeof service == "function") {
			this.description = service;
		}
		else {
			this.location = service;
		}
	};

	async import() {
		if (this.instance || this.description) return;	
		if (!this.location) throw new UndefinedError("Location for ${name}", { name: this.name });
		if (this.location[0] == " ") throw new Error("Service location start with space for ${service}.", { service: this.name });
		
		let relative = this.location[0] == ".";
		const qwebs = await this.injector.resolve("$qwebs");
		
		this.location = relative ? path.resolve(qwebs.root, this.location) : this.location;
		//console.log("import", chalk.yellow(this.name));
		
		let	object;
		try {
			object = require(this.location);
		}
		catch(error) {
			throw new Error("Error on require ${location}.", { service: this.name, location: this.location }, error);
		}		
		if (typeof object == "object") this.instance = object;
		else if (typeof object == "function") this.description = object;
		else throw new Error("Unknwon type of ${service}.", { service: this.name, location: this.location });
	};

	async create() {
		if (this.instance) return;
		if (!this.description) throw new Error("Description of ${service} is not defined.", { service: this.name, location: this.location });
		
		if (this.options.instanciate === false) {
			this.instance = this.description;
			return;
		}
		
		this.injector.plan[this.name] = this.injector.plan[this.name] || [];
		
		let args = []
		if (this.deps)
			throw new Error("Cyclic reference for service ${service}.", { service: this.name, location: this.location, dependencies: this.deps, resolvedDependencies: this.injector.plan[this.name] });

		try {
			const source = this.description.toString()
			this.deps = JsParser.getConstructorArguments(source);
			//this.annotations = JsParser.getAnnotations(source);
		}
		catch(error) {
			throw new Error("Failed to get constructor agruments for ${service}.", { service: this.name, location: this.location }, error);
		}
		
		for (let dep of this.deps) {	
			if (!dep || dep == "") continue; //ex deps = [""] => we ignore it 
			
			this.injector.plan[this.name].push(dep); //add dependency in plan
			let item = await this.injector.resolve(dep);
			args.push(item);
		}
		//let scope = Object.create(this.description.prototype);
		this.instance = new (Function.prototype.bind.apply(this.description, [null].concat(args)));
		if (!this.instance) throw new Error("Service ${service} cannot be created.", { service: this.name, location: this.location });
		//console.log("create", chalk.green(this.name));
	};

	async mount() {		
		if (this.mounted) return;
		if (this.instance && this.instance.mount) {
			//console.log("mount", chalk.magenta(this.name));			
			await this.instance.mount();
		}
		this.mounted = true;
	}

	async unmount() {
		if (!this.mounted) return;
		if (this.instance && this.instance.unmount) {
			//console.log("unmount", chalk.red(this.name), this.uuid);			
			await this.instance.unmount();
		}
		this.mounted = false;
	}

	toString() {
		if (this.location) return `${this.name} ${this.location}`;
		if (this.instance) return `${this.name} ${this.instance.constructor.name}`;
		return `${this.name}`;
	}
};

exports = module.exports = Injector;