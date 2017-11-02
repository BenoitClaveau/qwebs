/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class ServicesLoader {
    constructor($qwebs, $fs, $config) {
        if (!$qwebs) throw new Error("qwebs is not defined.");
        if (!$fs) throw new Error("fs is not defined.");
        if (!$config) throw new Error("config is not defined.");
        Object.assign(this, { $qwebs, $fs, $config });
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
