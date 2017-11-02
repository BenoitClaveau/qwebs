/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const url = require("url");
const path = require("path");
const Injector = require("./injector");
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
        this.inject("$fs", "./services/fs", { local: true });
        this.inject("$config", typeof options.config == "object" ? options.config : require(path.resolve(this.root, options.config)));
        this.inject("$services-loader", "./loaders/services", { local: true });
        this.inject("$event", "./services/event", { local: true });
        this.inject("$JSON", "./services/json", { local: true });
        this.inject("$JSONStream", "./services/json-stream", { local: true });
        this.inject("$qjimp", "./services/qjimp", { local: true });
        this.inject("$client", "./services/client", { local: true });
        this.inject("$stream-proxy", "./services/stream-proxy", { local: true });
    };

    async mount() {
        await this.resolve("$services-loader");
    }

    inject(name, location, options) {
        return this.injector.inject(name, location, options);
    };

    async resolve(name) {
        return await this.injector.resolve(name);
    };

    async unmount() {
        await this.injector.unmount();
    }
};

exports = module.exports = Qwebs;
