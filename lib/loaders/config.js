/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class ConfigLoader {
    constructor($file) {
        if (!$file) throw new Error("$file is not defined.");
        this.$file = $file;  
    };
    
    load(filepath = "./config.json") {
        const config = this.$file.load(filepath);
        if (config.compress == null) config.compress = true;
        if (config.verbose == null) config.verbose = false;
        return config;
    };
};

exports = module.exports = ConfigLoader;
