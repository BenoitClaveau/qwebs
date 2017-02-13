/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const path = require("path");
const walk = require("./../utils/walk.js");
const fs = require("fs");
const DataError = require("./../dataerror");

class Repository {
    constructor(folder, $initializer) {
        if (!folder) throw new DataError({ message: "Folder is not defined.", data: { folder: folder }});
        this.folder = folder;
        $initializer.push(this); //initialize function will be call web Qwebs is loading.
    };

    initialize() {
        return Promise.resolve().then(() => {
            let promises = [];

            let files = walk.get(this.folder);
            for (filepath of files) {            
                let route = filepath.substring(this.folder.length);
                let ext = path.extname(route).substr(1); //get extension without .
                route = route.slice(0, -(ext.length + 1)); //get file name withous extension and .
                let routes = route.split("/");
                
                let data = this;
                for (token of routes) {
                    if(!token) continue; //if filepath start with /
                    data[token] = data[token] || {};
                    data = data[token];
                }
                
                //TODO change encoding according to the extension
                if(data[ext]) throw new DataError({ message: "File already exists.", date: { file: filepath }});
                
                let promise = this.readFile(filepath, ext).then(content => {
                    data[ext] = content;
                }).catch(error => {
                    throw new DataError({ message: error.message, stack: error.stack });
                });

                promises.push(promise);
            };

            return Promise.all(promises);
        });
    };

    readFile(filepath, ext) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, "utf8", (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };
};

exports = module.exports = Repository;