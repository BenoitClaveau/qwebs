/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const DataError = require("./../dataerror");

class ConfigLoader {
    constructor($qwebs) {
        if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
        this.$qwebs = $qwebs;  
    };
    
    create(filepath) {
        filepath = filepath || "./config.json";
        
        let config;
        if (typeof filepath == "string") 
        {
            filepath = path.resolve(this.$qwebs.root, filepath);
            let str;
            try {
                str = fs.readFileSync(filepath);
            } 
            catch(error) {
                throw new DataError({ message: "Failed to read the configuration file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
            }
            if (!str) throw new DataError({ message: "Configuration file is empty.", data: { filepath: filepath }});
            try {
                config = JSON.parse(str);
            }
            catch(error) {
                throw new DataError({ message: "Failed to parse the configuration file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
            }
        }
        else if (filepath instanceof Object) config = filepath;
        else throw new DataError({ message: "Configuration type is not managed." });
        
        if (config.compress == null) config.compress = true;
        if (config.verbose == null) config.verbose = false;
        
        return config;
    };
};

exports = module.exports = ConfigLoader;
