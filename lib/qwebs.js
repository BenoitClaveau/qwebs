/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

require("./response"); //extend response

var path = require("path"),
    Injector = require("./injector"),
    DataError = require("./dataerror"),
    configLoader = require("./loaders/config"),
    bundleLoader = require("./loaders/bundle"),
    assetsLoader = require("./loaders/assets"),
    Q = require("q"); 

function Qwebs (location) {
    this.root = path.dirname(require.main.filename); //execution folder
    this.injector = new Injector();
    
    this.inject("$qwebs", this);
    this.inject("$injector", this.injector);
    this.inject("$config", configLoader.create(this, location));
    
    this.inject("$router", "./router", {local: true});
    this.inject("$qjimp", "./services/qjimp", {local: true});
    
    //this.inject("DataError", DataError, { isClass: true });
    //this.inject("Repository", RepositoryService, { isClass: true });
    
    this.router = this.resolve("$router");
};

Qwebs.prototype.load = function() {
    var self = this;
    
    return Q.try(function() {
              
        return assetsLoader.load(self).then(function(assets) {
            self.router.assets(assets);
            
            return bundleLoader.load(self).then(function(assets) {
                self.router.assets(assets);

            }).then(function() {
                return self.injector.load();
            });
        }); 
    });
};

Qwebs.prototype.inject = function(name, location, options) {
    this.injector.inject(name, location, options);
};

Qwebs.prototype.resolve = function(name) {
    return this.injector.resolve(name);
};

Qwebs.prototype.get = function(route) {
    self.router.get(route);
};

Qwebs.prototype.put = function(route) {
    self.router.put(route);
};

Qwebs.prototype.delete = function(route) {
    self.router.delete(route);
};

Qwebs.prototype.invoke = function(request, response, url) {
    self.router.invoke(request, response, url);
};



exports = module.exports = Qwebs;