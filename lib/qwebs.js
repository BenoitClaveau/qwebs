/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const path = require("path");
const Injector = require("./injector");

class Qwebs {
    constructor(options) {
        options = options || {};

        this.root = path.dirname(require.main.filename); //execution folder
        if (options.dirname) this.root = options.dirname;
        this.loaded = false;
        
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
        
        this.inject("$response", "./services/response", { local: true });
        this.inject("$responseProxy", "./services/response-proxy", { local: true });
        
        this.inject("$qjimp", "./services/qjimp", { local: true });
        this.inject("$repository", "./services/repository", { local: true, instanciate: false });
        this.inject("$client", "./services/client", { local: true });
        
        this.router = this.resolve("$router");
        
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
                        this.router.load();
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

    get(route, service, method) {
        let item = this.router.get(route);
        item.register(service, method);
        return item;
    };

    asset(route) {
        return this.router.asset(route);
    };

    post(route, service, method) {
        let item = this.router.post(route);
        item.register(service, method);
        return item;
    };

    put(route, service, method) {
        let item = this.router.put(route);
        item.register(service, method);
        return item;
    };

    delete(route, service, method) {
        let item = this.router.delete(route);
        item.register(service, method);
        return item;
    };

    invoke(request, response, url) {
        return this.router.invoke(request, response, url);
    };
};

exports = module.exports = Qwebs;
