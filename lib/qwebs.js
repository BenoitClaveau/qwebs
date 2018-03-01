/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";
const url = require("url");
const path = require("path");
const Injector = require(`./injector`);
const { Error } = require("oups");
const qs = require("qs");



class Qwebs {
    constructor(options = {}) {
        options.config = options.config || "./qwebs.json";
        
        this.root = path.dirname(require.main.filename); //execution folder
        if (options.dirname) this.root = options.dirname;
        
        this.config = typeof options.config == "object" ? options.config : require(path.resolve(this.root, options.config))
        
        this.injector = new Injector();
        this.loaded = false;
    };

    async load() {
        this.loaded = true;
        await this.inject("$qwebs", this);
        await this.inject("$config", this.config);
        await this.inject("$injector", this.injector);
        await this.inject("$string", `${__dirname}/services/string`);
        await this.inject("$fs", `${__dirname}/services/fs`);
        await this.inject("$event", `${__dirname}/services/event`);
        await this.inject("$json", `${__dirname}/services/json`);
        await this.inject("$json-stream", `${__dirname}/services/json-stream`);
        await this.inject("$qjimp", `${__dirname}/services/qjimp`);
        await this.inject("$client", `${__dirname}/services/client`);
        await this.inject("$walk", `${__dirname}/services/walk`);
        await this.inject("$crypto", `${__dirname}/services/crypto`);
        await this.inject("$password", `${__dirname}/services/password`);
        await this.inject("$repository-factory", `${__dirname}/services/repository-factory`);
        await this.inject("$services-loader", `${__dirname}/loaders/services`);
        await this.resolve("$string"); //force to create string
        await this.resolve("$services-loader"); //force to create service
        await this.injector.load();
    }

    inject(name, location, options) {
        return this.injector.inject(name, location, options);
    };

    async resolve(name) {
        if (!this.loaded) throw new Error("Qwebs is not loaded.")
        return await this.injector.resolve(name);
    };

    async unload() {
        await this.injector.unload();
    }
};

exports = module.exports = Qwebs;
