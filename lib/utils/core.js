/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

class Core {
    constructor() {
    };
    
    extend(destination, source) {
        for (let property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    };
};

exports = module.exports = new Core();