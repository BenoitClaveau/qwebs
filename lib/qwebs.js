/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const url = require("url");
const path = require("path");
const Injector = require("./injector");
const WebError = require("./WebError");
const qs = require("qs");

class Qwebs {
    constructor(options) {
        options = options || {};
        this.root = path.dirname(require.main.filename); //execution folder
        if (options.dirname) this.root = options.dirname;
        this.injector = new Injector();
        
        this.inject("$qwebs", this);
        this.inject("$injector", this.injector);
        this.inject("$file-loader", "./services/file-loader", { local: true });
        this.inject("$config-loader", "./loaders/config", { local: true });
        let $configLoader = this.resolve("$configLoader");
        
        this.config = $configLoader.create(options.config);
        this.inject("$config", this.config);
        
        this.inject("$qwebs-loader", "./loaders/qwebs", { local: true });
        this.inject("$content-type", "./services/content-type", { local: true });
        this.inject("$event", "./services/event", { local: true });
        this.inject("$json", "./services/json", { local: true });
        this.inject("$qjimp", "./services/qjimp", { local: true });
        this.inject("$client", "./services/client", { local: true });
        this.inject("$stream-proxy", "./services/stream-proxy", { local: true });
    };

    load() {
        return Promise.resolve().then(() => {
            let $qwebsLoader = this.resolve("$qwebs-loader");
            if (!$qwebsLoader) throw new WebError({ message: "$qwebsLoader is not defined." });

            return $qwebsLoader.load().then(content => {
                const loaders = content.services.map(service => {
                    this.$qwebs.resolve(service.name);
                }).filter(e => typeof e.load === "function");

                return Promise.all(loader.map(e => e.load()));  //call load function of each service
            })
        });
    }

    inject(name, location, options) {
        return this.injector.inject(name, location, options);
    };

    resolve(name) {
        return this.injector.resolve(name);
    };

    dispose() {
        this.resolve("$event").emit("dispose");        
    }
};

exports = module.exports = Qwebs;
