/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const WebError = require("./../WebError");

class ConfigLoader {
    constructor($fileLoader) {
        if (!$fileLoader) throw new WebError({ message: "$fileLoader is not defined." });
        this.$fileLoader = $fileLoader;  
    };
    
    create(filepath) {
        const config = this.$fileLoader.readFileSync(filepath || "./config.json");
        if (config.compress == null) config.compress = true;
        if (config.verbose == null) config.verbose = false;
        return config;
    };
};

exports = module.exports = ConfigLoader;
