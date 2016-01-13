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
    
    return Q.try(function() {
        
        var $config = $qwebs.resolve("$config");
        var $router = $qwebs.resolve("$router");
        
        var filepath = $config.routes;
        if (!filepath) return {};

        if (typeof filepath == "string") 
        {
            try {
                filepath = path.resolve($qwebs.root, filepath);
                return Q.ninvoke(fs, "readFile", filepath).then(function(str) {
                    return JSON.parse(str);  
                });
            }
            catch(error) {
                throw new DataError({ message: "Failed to read the bundle file: " + filepath + ". " +  error.message });
            }
        }
        else if (filepath instanceof Object) return filepath;
        else throw new DataError({ message: "Qwebs type is not managed." });
        
    }).then(function(routes) {  //inject services
        
        routes.services = routes.services || [];
        
        routes.services.forEach(function(service) {
            $router.inject(service.name, service.location, service.options);
        });
        
        return routes;
        
    }).then(function(routes) { //load locators
    
        routes.locators = routes.locators || [];
        
        routes.locators.forEach(function(locator) {
            if (locator.get) $router.get(locator.get, locator.service, locator.method);
            else if (locator.post) $router.get(locator.post, locator.service, locator.method);
            else if (locator.put) $router.get(locator.put, locator.service, locator.method);
            else if (locator.delete) $router.get(locator.delete, locator.service, locator.method);
        });
        
        return routes;
    })
};

exports = module.exports = new QwebsLoader();
