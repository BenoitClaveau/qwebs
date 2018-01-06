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
        await this.inject("$fs", `${__dirname}/services/fs`);
        await this.inject("$event", `${__dirname}/services/event`);
        await this.inject("$json", `${__dirname}/services/json`);
        await this.inject("$json-stream", `${__dirname}/services/json-stream`);
        await this.inject("$qjimp", `${__dirname}/services/qjimp`);
        await this.inject("$client", `${__dirname}/services/client`);
        await this.inject("$walk", `${__dirname}/services/walk`);
        await this.inject("$repository-factory", `${__dirname}/services/repository-factory`);
        await this.inject("$services-loader", `${__dirname}/loaders/services`);
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

<<<<<<< HEAD
    get(route, service, method, options) {
        let item = this.resolve("$router").get(route);
        item.register(service, method, options);
        return item;
    };

    asset(route) {
        return this.resolve("$router").asset(route);
    };

    post(route, service, method, options) {
        let item = this.resolve("$router").post(route);
        item.register(service, method, options);
        return item;
    };

    put(route, service, method, options) {
        let item = this.resolve("$router").put(route);
        item.register(service, method, options);
        return item;
    };

    patch(route, service, method, options) {
        let item = this.resolve("$router").patch(route);
        item.register(service, method, options);
        return item;
    };

    delete(route, service, method, options) {
        let item = this.resolve("$router").delete(route);
        item.register(service, method, options);
        return item;
    };

    invoke(request, response, overriddenUrl) {
        return Promise.resolve().then(() => {
            if (overriddenUrl) request.url = overriddenUrl;
            request.part = url.parse(decodeURI(request.url));
            request.pathname = request.part.pathname;
            request.query = request.part.query ? qs.parse(request.part.query) : {};
            return this.resolve("$router").invoke(request, response);
        }).catch(error => {
            if (!error.statusCode) throw new DataError({ statusCode: 500, request: request, message: error.message, stack: error.stack });
            if (!error.request) error.request = request;
            throw error;
        });
    };

    onInjectorChanged(current, previous) {
        if (current.name === "$response") { //need to rebind wrapper
            this.resolve("$responseProxy", { reload: true }); //force to reload;
        }
    }

    toString() {
        let router = this.resolve("$router");
        return `${this.injector}
${router}`;
    }

    dispose() {
        this.resolve("$event").emit("dispose");        
=======
    async unload() {
        await this.injector.unload();
>>>>>>> 56f68bcd2e89f9418c3b91a8fb07035a5fa4cd55
    }
};

exports = module.exports = Qwebs;
