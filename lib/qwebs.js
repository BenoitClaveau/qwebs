/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const url = require("url");
const path = require("path");
const Injector = require("./injector");
const DataError = require("./dataerror");
const qs = require("qs");

class Qwebs {
    constructor(options) {
        options = options || {};
        this.loaded = false;
        this.root = path.dirname(require.main.filename); //execution folder
        if (options.dirname) this.root = options.dirname;
        this.injector = new Injector();
        
        this.inject("$qwebs", this);
        this.inject("$injector", this.injector);
        
        this.inject("$configLoader", "./loaders/config", { local: true });
        let $configLoader = this.resolve("$configLoader");
        
        this.config = $configLoader.create(options.config);
        this.inject("$config", this.config);
        
        this.inject("$bundleLoader", "./loaders/bundle", { local: true });
        this.inject("$assetsLoader", "./loaders/assets", { local: true });
        this.inject("$routesLoader", "./loaders/routes", { local: true });

        this.inject("$router", "./router", { local: true });
        
        this.inject("$event", "./services/event", { local: true });
        this.inject("$json", "./services/json", { local: true });
        this.inject("$response", "./services/response", { local: true });
        this.inject("$responseProxy", "./services/response-proxy", { local: true });
        
        this.inject("$qjimp", "./services/qjimp", { local: true });
        this.inject("$client", "./services/client", { local: true });
    };

    load() {
        return Promise.resolve().then(() => {
            let $assetsLoader = this.resolve("$assetsLoader");
            if (!$assetsLoader) throw new DataError({ message: "$assetsLoader is not defined." });

            let $bundleLoader = this.resolve("$bundleLoader");
            if (!$bundleLoader) throw new DataError({ message: "$bundleLoader is not defined." });

            let $routesLoader = this.resolve("$routesLoader");
            if (!$routesLoader) throw new DataError({ message: "$routesLoader is not defined." });

            return $assetsLoader.load().then(() => {
                return $bundleLoader.load().then(() => {
                    return $routesLoader.load().then(() => {
                        this.injector.load();
                        this.resolve("$router").load();
                        this.loaded = true;
                        return this;
                    });
                });
            });
        });
    };

    inject(name, location, options) {
        return this.injector.inject(name, location, options);
    };

    resolve(name) {
        return this.injector.resolve(name);
    };

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
    }
};

exports = module.exports = Qwebs;
