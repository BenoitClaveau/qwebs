/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const DataError = require("./../dataerror");

class QwebsLoader {
    constructor($qwebs, $config) {
        if (!$qwebs) throw new DataError({ message: "$qwebs instance is not defined." });
        if (!$config) throw new DataError({ message: "$config is not defined." });
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
                    throw new DataError({ message: "Failed to read the qwebs injector file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
                try {
                    return JSON.parse(str);
                }
                catch(error) {
                    throw new DataError({ message: "Failed to parse qwebs injector file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
            }
            else if (filepath instanceof Object) return filepath;
            else throw new DataError({ message: "Type is not managed." });
            
        }).then(content => {  //inject services
            content.services = content.services || [];
            for (let service of content.services) {
                this.$qwebs.inject(service.name, service.location, service.options);
            };
            return content;
        });
    };
};

exports = module.exports = QwebsLoader;
