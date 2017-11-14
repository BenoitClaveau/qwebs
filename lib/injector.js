/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const path = require('path');
const { Error, UndefinedError } = require("oups");
const StringUtils = require("./utils/string");
const JsParser = require("./utils/js-parser");
const chalk = require('chalk');
const uuid = require('uuid/v4');

class Injector {
    constructor() {
		this.container = {};
		this.plan = {};
	};

	inject(name, location, options) {
		if (!name) throw new UndefinedError("Service name"); 
		if (!location) throw new UndefinedError("Service location");
		
		var item = new Item(this, name, location, options);
		if (name in this.container) {
			var old = this.container[name];
			this.container[name] = item;
			//this.resolve("$qwebs").onInjectorChanged({ current: item, previous: old }); //replace service;
		}
		else this.container[name] = item;
	};

	async load() {
		if (this.container.length == 0) return;
		let services = Object.entries(this.container).map(([k, v]) => v);
		await Promise.all(services.map(e => e.import()));		
		await Promise.all(services.map(e => e.create()));
		await Promise.all(services.map(e => e.mount()));
	};

	async unload() {
		if (this.container.length == 0) return;
		let services = Object.entries(this.container).map(([k, v]) => v);
		await Promise.all(services.map(e => e.unmount()));
	};

	async resolve(name, options = {}) {
		if (!name) throw new UndefinedError("Service name", { name: name });

		let item = this.container[name];

		if (!item) { //Trying with dash name ex: myService (in constructor arguments) will become my-service
			let dashName = StringUtils.camelCaseToDash(name); 
			item = this.container[dashName];
		}
		
		if (!item) throw new Error("Service ${name} has not been injected.", { name: name });
		if (item.instance && !options.reload) return item.instance;
		
		if (item.mounted) await item.unmount();
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
		if (!this.location) return;

		const qwebs = await this.injector.resolve("$qwebs");

		if (this.location[0] == " ") throw new Error("Service location start with space for ${service}.", { service: this.name });
		let	object;

		let relative = this.location[0] == ".";
		this.location = relative ? path.resolve(qwebs.root, this.location) : this.location;
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
		if (this.instance) return true;
		if (!this.description) throw new Error("Description of ${service} is not defined.", { service: this.name, location: this.location });
		
		if (this.options.instanciate === false) {
			this.instance = this.description;
			return;
		}
		
		this.injector.plan[this.name] = this.injector.plan[this.name] || [];
		
		let args = []
		if (this.deps) throw new Error("Cyclic reference for service ${service}.", { service: this.name, location: this.location, plan: this.injector.plan[this.name] });

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
	};

	async mount() {
		if (this.mounted) return;
		console.log(`attempt to mount ${this.name} ${chalk.blue(this.uuid)}.`)
		this.instance && this.instance.mount && await this.instance.mount();
		this.mounted = true;
		console.log(`Service ${this.name} ${chalk.blue(this.uuid)} is mounted.`)
	}

	async unmount() {
		if (!this.mounted) return;
		this.instance && this.instance.unmount && await this.instance.unmount();
		this.mounted = false;
		console.log(`Service ${this.name} ${chalk.blue(this.uuid)} is unmounted.`)
	}

	toString() {
		if (this.location) return `${this.name} ${this.location}`;
		if (this.instance) return `${this.name} ${this.instance.constructor.name}`;
		return `${this.name}`;
	}
};

exports = module.exports = Injector;