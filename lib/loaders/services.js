/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class ServicesLoader {
    constructor($qwebs, $file, $config) {
        if (!$qwebs) throw new Error("$qwebs is not defined.");
        if (!$file) throw new Error("$file is not defined.");
        if (!$config) throw new Error("$config is not defined.");
        this.$qwebs = $qwebs;  
        this.$file = $file;  
        this.$config = $config;  
    };
    
    load(filepath) {
        const file = this.$file.load(this.$config.services);
        file.services = file.services || [];
        for (let service of file.services) {
            this.$qwebs.inject(service.name, service.location, service.options);
        };
        return file;
    };
};

exports = module.exports = ServicesLoader;
