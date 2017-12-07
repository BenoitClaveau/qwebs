/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { UndefinedError } = require("oups");
const path = require("path");

class ServicesLoader {

    constructor($qwebs, $fs, $config) {
        if (!$qwebs) throw new UndefinedError("$qwebs");
        if (!$fs) throw new UndefinedError("$fs");
        if (!$config) throw new UndefinedError("$config");
        this.qwebs = $qwebs;
        this.fs = $fs;
        this.config = $config;
        this.services = [];

        if ($config.services == null || /false/ig.test($config.services)) return;

        const absolute = path.resolve($qwebs.root, $config.services);
        const dir = path.dirname(absolute);
        this.relative = path.relative($qwebs.root, dir);

        const file = $fs.loadSync($config.services);
        if (!file || !file.services) return;

        for (let e of file.services) {
            const location = path.isAbsolute(e.location) ? e.location : path.resolve($qwebs.root, this.relative, e.location);
            const service = $qwebs.inject(e.name, location, e.options);
            this.services.push(service);
        }
    }
    
    async mount() {
        const { services } = this;
        for (let service of services)
            await service.import();

        for (let service of services)
            await service.create();

        for (let service of services)
            await service.mount();
    };
};

exports = module.exports = ServicesLoader;
