/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var fs = require('fs');

function Walk(){
}

Walk.prototype = {
    get: function (dir, excluded) {
        excluded = excluded || [];
        var newExcluded = excluded.map(function (e) {
            return dir + '/' + e;
        });
        return this.invoke(dir, newExcluded);
    },
    invoke: function (dir, excluded) {
        if (excluded.indexOf(dir) != -1) {
            console.log(dir + ' is excluded');
            return [];
        }
        var self = this;
        var results = []
        var list = fs.readdirSync(dir);
        list.forEach(function (file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) results = results.concat(self.invoke(file, excluded));
            else {
                if (excluded.indexOf(file) == -1) results.push(file);
            }
        });
        return results;
    }
};

exports = module.exports = new Walk();
