/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class ConfigLoader {
    constructor($fileLoader) {
        if (!$fileLoader) throw new Error("$fileLoader is not defined.");
        this.$fileLoader = $fileLoader;  
    };
    
    load(filepath = "./config.json") {
        const config = this.$fileLoader.load(filepath);
        if (config.compress == null) config.compress = true;
        if (config.verbose == null) config.verbose = false;
        return config;
    };
};

exports = module.exports = ConfigLoader;
