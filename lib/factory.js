/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

let qwebs = null; //intance is store in the module to avoid reloading 
let lock = false;

class Factory {

    /**
     * Factory.load(() => new Qwebs({}))
     */
    static create(fn) {
        return Promise.resolve({}).then(() => {
            lock = true;
            if (qwebs) return;
            return fn().load().then(i => {
                qwebs = i;
            });
        }).then(() => {
            lock = false;
            return qwebs;
        }).catch(error => {
            lock = false;
            throw error;
        });
    }

    static get instance () { return qwebs; }
}

exports = module.exports = Factory;
