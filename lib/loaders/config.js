/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class ConfigLoader {
    constructor($fs) {
        if (!$fs) throw new Error("$fs is not defined.");
        this.$fs = $fs;  
    };
    
    load(filepath = "./config.json") {
        const config = this.$fs.load(filepath);
        if (config.compress == null) config.compress = true;
        if (config.verbose == null) config.verbose = false;
        return config;
    };
};

exports = module.exports = ConfigLoader;
