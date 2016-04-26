/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const DataError = require("./../dataerror");

class QwebsLoader {
    constructor($qwebs, $config) {
        if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
        if (!$config) throw new DataError({ message: "Config is not defined." });
        this.$qwebs = $qwebs;
        this.$config = $config;
    };
    
    load() {
        return Promise.resolve().then(() => {
            let filepath = this.$config.routes;
            if (!filepath) return {};

            if (typeof filepath == "string") 
            {
                filepath = path.resolve(this.$qwebs.root, filepath);
                let str;
                try {
                    str = fs.readFileSync(filepath);
                } 
                catch(error) {
                    throw new DataError({ message: "Failed to read the routes file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
                try {
                    return JSON.parse(str);
                }
                catch(error) {
                    throw new DataError({ message: "Failed to parse the routes file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
            }
            else if (filepath instanceof Object) return filepath;
            else throw new DataError({ message: "Qwebs type is not managed." });
            
        }).then(routes => {  //inject services
            routes.services = routes.services || [];
            routes.services.forEach(service => {
                this.$qwebs.inject(service.name, service.location, service.options);
            });
            return routes;
        }).then(routes => { //load locators
            routes.locators = routes.locators || [];
            routes.locators.forEach(locator => {
                if (locator.get) this.$qwebs.get(locator.get, locator.service, locator.method);
                else if (locator.post) this.$qwebs.post(locator.post, locator.service, locator.method);
                else if (locator.put) this.$qwebs.put(locator.put, locator.service, locator.method);
                else if (locator.delete) this.$qwebs.delete(locator.delete, locator.service, locator.method);
                else throw new DataError({ message: "Unknown locator methode type.", data: locator });
            });
            return routes;
        });
    };
};

exports = module.exports = QwebsLoader;
