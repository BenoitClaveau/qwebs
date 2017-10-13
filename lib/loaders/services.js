/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const WebError = require("./../WebError");

class ServicesLoader {
    constructor($qwebs, $fileLoader) {
        if (!$fileLoader) throw new WebError({ message: "$fileLoader is not defined." });
        this.$fileLoader = $fileLoader;  
    };
    
    create(filepath) {
        const file = this.$fileLoader.readFileSync(filepath || "./services.json");
        file.services = file.services || [];
        for (let service of file.services) {
            this.$qwebs.inject(service.name, service.location, service.options);
        };
        return file;
    };
};

exports = module.exports = ServicesLoader;
