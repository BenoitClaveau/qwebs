/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const WebError = require("./../WebError");

class ServicesLoader {
    constructor($qwebs, $fileLoader, $config) {
        if (!$qwebs) throw new WebError({ message: "$qwebs is not defined." });
        if (!$fileLoader) throw new WebError({ message: "$fileLoader is not defined." });
        if (!$config) throw new WebError({ message: "$config is not defined." });
        this.$qwebs = $qwebs;  
        this.$fileLoader = $fileLoader;  
        this.$config = $config;  
    };
    
    load(filepath) {
        const file = this.$fileLoader.load(this.$config.services);
        file.services = file.services || [];
        for (let service of file.services) {
            this.$qwebs.inject(service.name, service.location, service.options);
        };
        return file;
    };
};

exports = module.exports = ServicesLoader;
