/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var fs = require("fs"),
    path = require("path"),
    DataError = require("./../dataerror"),
    Q = require("q");

function QwebsLoader (){
};

QwebsLoader.prototype.constructor = QwebsLoader;

QwebsLoader.prototype.load = function($qwebs) {

    if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
    
    var $config = $qwebs.resolve("$config");
        
    return Q.try(function() {
  
        var filepath = $config.routes;
        if (!filepath) return {};

        if (typeof filepath == "string") 
        {
            try {
                filepath = path.resolve($qwebs.root, filepath);
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
            $qwebs.inject(service.name, service.location, service.options);
        });
        
        return routes;
        
    }).then(function(routes) { //load locators
    
        routes.locators = routes.locators || [];
        
        routes.locators.forEach(function(locator) {
            if (locator.get) $qwebs.get(locator.get, locator.service, locator.method);
            else if (locator.post) $qwebs.post(locator.post, locator.service, locator.method);
            else if (locator.put) $qwebs.put(locator.put, locator.service, locator.method);
            else if (locator.delete) $qwebs.delete(locator.delete, locator.service, locator.method);
            else throw new DataError({ message: "Unknown locator methode type.", data: locator });
        });
        
        return routes;
    })
};

exports = module.exports = new QwebsLoader();
