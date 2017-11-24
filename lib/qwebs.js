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
        
        this.config = typeof options.config == "object" ? options.config : require(path.resolve(this.root, options.config))
        this.config.services = this.config.services || "./services.json";

        this.injector = new Injector();
        this.loaded = false;
    };

    async load() {
        if (this.loaded) return;
        await this.inject("$qwebs", this);
        await this.inject("$config", this.config);
        await this.inject("$injector", this.injector);
        await this.inject("$fs", `${__dirname}/services/fs`);
        await this.inject("$services-loader", `${__dirname}/loaders/services`);
        await this.inject("$event", `${__dirname}/services/event`);
        await this.inject("$json", `${__dirname}/services/json`);
        await this.inject("$json-stream", `${__dirname}/services/json-stream`);
        await this.inject("$qjimp", `${__dirname}/services/qjimp`);
        await this.inject("$client", `${__dirname}/services/client`);
        await this.injector.load();
    }

    async inject(name, location, options) {
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
