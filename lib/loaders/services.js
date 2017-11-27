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
        
        //inject new services
        const injector = await this.qwebs.resolve("$injector");
        await Promise.all(file.services.map(e => this.qwebs.inject(e.name, e.location, e.options)));

        //import, create & mount new services
        const names = file.services.map(e => e.name);
        const entries = injector.entries.reduce((previous, current) => {
            if (names.some(e => e == current.name)) previous.push(current);
            return previous;
        }, []);

        await Promise.all(entries.map(e => e.service.import()));
        await Promise.all(entries.map(e => e.service.create()));
		await Promise.all(entries.map( e => e.service.mount()));
    };
};

exports = module.exports = ServicesLoader;
