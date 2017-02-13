/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const Jimp = require("jimp");
const DataError = require("./../dataerror");

class Initializer {
    constructor() {
        this.services = [];
    };
    
    push(service) {
        this.services.push(service);
    };

    load() {
        let promises = [];
        for(let service of this.services) {
            promises.push(service.initialize());
        }
        return Promise.all(promises);
    }
};

exports = module.exports = Initializer;