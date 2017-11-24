/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { UndefinedError } = require("oups");

class ServicesLoader {
    constructor($qwebs, $fs, $config) {
        if (!$qwebs) throw new UndefinedError("$qwebs");
        if (!$fs) throw new UndefinedError("$fs");
        if (!$config) throw new UndefinedError("$config");
        this.qwebs = $qwebs;
        this.fs = $fs;
        this.config = $config;
    };
    
    async mount() {
        const file = await this.fs.load(this.config.services);
        if (!file || !file.services) return;
        await Promise.all(file.services.map(service => {
            this.qwebs.inject(service.name, service.location, service.options);
        }))
    };
};

exports = module.exports = ServicesLoader;
