/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { UndefinedError } = require("oups");

class ServicesLoader {
    constructor($qwebs, $fs, $config) {
        if (!$qwebs) throw new UndefinedError("$qwebs");
        if (!$fs) throw new UndefinedError("$fs");
        if (!$config) throw new UndefinedError("$config");
        this.$qwebs = $qwebs;  
        this.$fs = $fs;  
        this.$config = $config;  
    };
    
    async load(filepath) {
        const file = await this.$fs.load(this.$config.services);
        file.services = file.services || [];
        for (let service of file.services) {
            this.$qwebs.inject(service.name, service.location, service.options);
        };
        return file;
    };
};

exports = module.exports = ServicesLoader;
