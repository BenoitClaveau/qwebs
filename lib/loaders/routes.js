/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const WebError = require("./../WebError");

class QwebsLoader {
    constructor($qwebs, $config) {
        if (!$qwebs) throw new WebError({ message: "$qwebs instance is not defined." });
        if (!$config) throw new WebError({ message: "$config is not defined." });
        this.$qwebs = $qwebs;
        this.$config = $config;
    };
    
    load() {
        return Promise.resolve().then(() => {
            let filepath = this.$config.qwebs;
            if (!filepath) return {};

            if (typeof filepath == "string") 
            {
                filepath = path.resolve(this.$qwebs.root, filepath);
                let str;
                try {
                    str = fs.readFileSync(filepath);
                } 
                catch(error) {
                    throw new WebError({ message: "Failed to read the route file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
                try {
                    return JSON.parse(str);
                }
                catch(error) {
                    throw new WebError({ message: "Failed to parse route file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
            }
            else if (filepath instanceof Object) return filepath;
            else throw new WebError({ message: "Type is not managed." });
            
        }).then(routes => {  //inject services
            routes.services = routes.services || [];
            for (let service of routes.services) {
                this.$qwebs.inject(service.name, service.location, service.options);
            };
            return routes;
        });
    };
};

exports = module.exports = QwebsLoader;
