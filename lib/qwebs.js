/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var path = require("path"),
    Injector = require("./injector"),
    configLoader = require("./loaders/config"),
    bundleLoader = require("./loaders/bundle"),
    assetsLoader = require("./loaders/assets"),
    routesLoader = require("./loaders/routes"),
    Q = require("q"); 

function Qwebs (options) {
    options = options || {};
    var self = this;
    
    return Q.try(function() {
    
        self.root = path.dirname(require.main.filename); //execution folder
        if (options.dirname) self.root = options.dirname;
        
        self.injector = new Injector();
        
        self.inject("$qwebs", self);
        self.inject("$injector", self.injector);
        
        self.inject("$config", configLoader.create(self, options.config));
        self.inject("$router", "./router", { local: true });
        
        self.inject("$response", "./services/response", { local: true });
        self.inject("$responseProxy", "./services/response-proxy", { local: true });
        
        self.inject("$qjimp", "./services/qjimp", { local: true });
        self.inject("$repository", "./services/repository", { local: true, instanciate: false });
        
        self.router = self.resolve("$router");
        self.loaded = false;
        
        return this.routesLoader.load(this);
    
    });
};

Qwebs.prototype.load = function() {
    var self = this;
    
    return assetsLoader.load(self).then(function() {
        return bundleLoader.load(self).then(function() {
            return self.injector.load().then(function() {
                return self.router.load().then(function() {
                    self.loaded = true;
                    console.log("Qwebs is loaded.")
                    return self;
                });
            });
        });
    });
};

Qwebs.prototype.inject = function(name, location, options) {
    return this.injector.inject(name, location, options);
};

Qwebs.prototype.resolve = function(name) {
    return this.injector.resolve(name);
};

Qwebs.prototype.get = function(route, service, method) {
    var item = this.router.get(route);
    item.register(service, method);
    return item;
};

Qwebs.prototype.post = function(route, service, method) {
    var item = this.router.post(route);
    item.register(service, method);
    return item;
};

Qwebs.prototype.put = function(route, service, method) {
    var item = this.router.put(route);
    item.register(service, method);
    return item;
};

Qwebs.prototype.delete = function(route, service, method) {
    var item = this.router.delete(route);
    item.register(service, method);
    return item;
};

Qwebs.prototype.invoke = function(request, response, url) {
    return this.router.invoke(request, response, url);
};

exports = module.exports = function(options) {
    return new Qwebs(options);
};
