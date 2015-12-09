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
    Q = require("q"); 

function Qwebs (options) {
    options = options || {};
    
    this.root = path.dirname(require.main.filename); //execution folder
    if (options.dirname) this.root = options.dirname;
    
    this.injector = new Injector();
    
    this.inject("$qwebs", this);
    this.inject("$injector", this.injector);
    
    this.inject("$config", configLoader.create(this, options.config));
    this.inject("$router", "./router", { local: true });
    
    this.inject("$response", "./services/response", { local: true });
    this.inject("$responseWrapper", "./services/response-wrapper", { local: true });
    
    this.inject("$qjimp", "./services/qjimp", { local: true });
    this.inject("$repository", "./services/repository", { local: true, instanciate: false });
    
    this.router = this.resolve("$router");
};

Qwebs.prototype.load = function() {
    var self = this;
    
    return Q.try(function() {
        return assetsLoader.load(self).then(function(assets) {
            return self.router.assets(assets);
        });
    }).then(function() {
        return bundleLoader.load(self).then(function(assets) {
            return self.router.assets(assets);
        });
    }).then(function() {
        return self.injector.load();
    }).then(function() {
        return self.router.load();
    }).then(function() {
        console.log("Qwebs is loaded.");
        return self;
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

exports = module.exports = Qwebs;