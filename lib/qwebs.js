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
        options.config = options.config || {};
        this.root = path.dirname(require.main.filename); //execution folder
        if (options.dirname) this.root = options.dirname;
        this.injector = new Injector();
        
        this.inject("$qwebs", this);
        this.inject("$injector", this.injector);
        this.inject("$fs", `${__dirname}/services/fs`);
        this.inject("$config", typeof options.config == "object" ? options.config : require(path.resolve(this.root, options.config)));
        this.inject("$services-loader", `${__dirname}/loaders/services`);
        this.inject("$event", `${__dirname}/services/event`);
        this.inject("$json", `${__dirname}/services/json`);
        this.inject("$json-stream", `${__dirname}/services/json-stream`);
        this.inject("$qjimp", `${__dirname}/services/qjimp`);
        this.inject("$client", `${__dirname}/services/client`);
    };

    async load() {
        await this.resolve("$services-loader");     //inject services
        await this.injector.load();
    }

    inject(name, location, options) {
        return this.injector.inject(name, location, options);
    };

    async resolve(name) {
        return await this.injector.resolve(name);
    };

    async unload() {
        await this.injector.unload();
    }
};

exports = module.exports = Qwebs;
