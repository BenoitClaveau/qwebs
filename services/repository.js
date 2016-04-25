/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const path = require("path");
const walk = require("./../utils/walk.js");
const fs = require("fs");
const DataError = require("./../dataerror");

class Repository {
    constructor(folder) {
        if (!folder) throw new DataError({ message: "Folder is not defined.", data: { folder: folder }});
        
        var files = walk.get(folder);
        for (var i in files) {
            var filepath = files[i];
            
            var route = filepath.substring(folder.length);
            var ext = path.extname(route).substr(1); //get extension without .
            route = route.slice(0, -(ext.length + 1)); //get file name withous extension and .
            var routes = route.split("/");
            
            var data = this;
            for (var j in routes) {
                var token = routes[j];
                if(!token) continue; //if filepath start with /
                data[token] = data[token] || {};
                data = data[token];
            }
            
            //TODO change encoding according to the extension
            if(data[ext]) throw new DataError({ message: "File already exists.", date: { file: filepath }});
            data[ext] = fs.readFileSync(filepath, "utf8");
        };
    };
};

exports = module.exports = {
    create: function(folder) {
        return new Repository(folder);
    }
};