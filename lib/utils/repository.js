/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const path = require("path");
const walk = require("../utils/walk.js");
const fs = require("fs");
const { Error, UndefinedError } = require("oups");

class Repository {
}

class RepositoryFactory {
    
    constructor($fs) {
        this.$fs = $fs;
    }

    async create(folder) { 
        if (!folder) throw new UndefinedError("Folder ${folder}.", { folder: folder });

        let repository = new Repository();
        let files = walk.get(folder);

        await Promise.all(files.map(filepath => {
            let route = filepath.substring(folder.length);
            let ext = path.extname(route).substr(1); //get extension without .
            route = route.slice(0, -(ext.length + 1)); //get file name withous extension and .
            let routes = route.split("/");
            
            for (let token of routes) {
                if(!token) continue; //if filepath start with /
                repository[token] = repository[token] || {};
                repository = repository[token];
            }
            
            if(repository[ext]) throw new Error("File ${file} already exists.", { file: filepath });
            
            repository[ext] = await this.$fs.readFile(filepath, ext);
        }));
        return repository;
    };
};

exports = module.exports = RepositoryFactory;