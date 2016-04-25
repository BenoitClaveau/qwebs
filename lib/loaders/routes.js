/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const DataError = require("./../dataerror");
const Q = require("q");

class QwebsLoader {
    constructor($qwebs, $config) {
        if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
        if (!$config) throw new DataError({ message: "Config is not defined." });
        this.$qwebs = $qwebs;
        this.$config = $config;
    };
    
    load() {
        var self = this;
        
        return Q.try(function() {
    
            var filepath = self.$config.routes;
            if (!filepath) return {};

            if (typeof filepath == "string") 
            {
                try {
                    filepath = path.resolve(self.$qwebs.root, filepath);
                    return Q.ninvoke(fs, "readFile", filepath).then(function(str) {
                        try {
                            return JSON.parse(str);
                        }
                        catch(error) {
                            throw new DataError({ message: "Failed to parse the routes file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                        }
                    });
                }
                catch(error) {
                    throw new DataError({ message: "Failed to read the routes file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
            }
            else if (filepath instanceof Object) return filepath;
            else throw new DataError({ message: "Qwebs type is not managed." });
            
        }).then(function(routes) {  //inject services
            
            routes.services = routes.services || [];
            
            routes.services.forEach(function(service) {
                self.$qwebs.inject(service.name, service.location, service.options);
            });
            
            return routes;
            
        }).then(function(routes) { //load locators
        
            routes.locators = routes.locators || [];
            
            routes.locators.forEach(function(locator) {
                if (locator.get) self.$qwebs.get(locator.get, locator.service, locator.method);
                else if (locator.post) self.$qwebs.post(locator.post, locator.service, locator.method);
                else if (locator.put) self.$qwebs.put(locator.put, locator.service, locator.method);
                else if (locator.delete) self.$qwebs.delete(locator.delete, locator.service, locator.method);
                else throw new DataError({ message: "Unknown locator methode type.", data: locator });
            });
            
            return routes;
        });
    };
};

exports = module.exports = QwebsLoader;
