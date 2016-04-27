/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const fs = require("fs");

class Walk {
    constructor() {
    };
    
    get(dir, excluded) {
        excluded = excluded || [];
        let newExcluded = excluded.map(e => {
            return dir + "/" + e;
        });
        return this.invoke(dir, newExcluded);
    };
        
    invoke(dir, excluded) {
        if (excluded.indexOf(dir) != -1) {
            console.log(dir + " is excluded");
            return [];
        }
        
        let results = []
        let list = fs.readdirSync(dir);
        
        let count = list.length;
        for (let i = 0; i < count; i++) {
            let file = dir + "/" + list[i];
            let stat = fs.statSync(file);
            if (stat && stat.isDirectory()) results = results.concat(this.invoke(file, excluded));
            else {
                if (excluded.indexOf(file) == -1) results.push(file);
            }
        }
        return results;
    };
};
exports = module.exports = new Walk();
