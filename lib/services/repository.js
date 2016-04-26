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
        
        let files = walk.get(folder);
        for (let i in files) {
            let filepath = files[i];
            
            let route = filepath.substring(folder.length);
            let ext = path.extname(route).substr(1); //get extension without .
            route = route.slice(0, -(ext.length + 1)); //get file name withous extension and .
            let routes = route.split("/");
            
            let data = this;
            for (let j in routes) {
                let token = routes[j];
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
    create: folder => {
        return new Repository(folder);
    }
};