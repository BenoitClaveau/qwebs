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
        if (this.config.services == null || /false/ig.test(this.config.services)) return;
        
        const file = await this.fs.load(this.config.services);
        if (!file || !file.services) return;
        
        //inject new services
        const injector = await this.qwebs.resolve("$injector");

        for (let e of file.services)
            await this.qwebs.inject(e.name, e.location, e.options);

        //import, create & mount new services
        const names = file.services.map(e => e.name);
        const entries = injector.entries.reduce((previous, current) => {
            if (names.some(e => e == current.name)) previous.push(current);
            return previous;
        }, []);

        for (let e of entries)
            await e.service.import();

        for (let e of entries)
            await e.service.create();

        for (let e of entries)
            await e.service.mount();
    };
};

exports = module.exports = ServicesLoader;
