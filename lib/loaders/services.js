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
    
    async mount() {
        const file = await this.$fs.load(this.$config.services);
        if (!file || !file.services) return;
        await Promise.all(file.services.map(service => {
            this.$qwebs.inject(service.name, service.location, service.options);
        }))
    };
};

exports = module.exports = ServicesLoader;
