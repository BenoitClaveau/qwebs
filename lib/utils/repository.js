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
const Lock = require("./lock");

class Repository {
    constructor(folder) {
        if (!folder) throw new DataError({ message: "Folder is not defined.", data: { folder: folder }});

        let lock = new Lock();

        Promise.resolve().then(() => {
            let files = walk.get(folder);
            for (let filepath of files) {            
                let route = filepath.substring(folder.length);
                let ext = path.extname(route).substr(1); //get extension without .
                route = route.slice(0, -(ext.length + 1)); //get file name withous extension and .
                let routes = route.split("/");
                
                let data = this;
                for (let token of routes) {
                    if(!token) continue; //if filepath start with /
                    data[token] = data[token] || {};
                    data = data[token];
                }
                
                //TODO change encoding according to the extension
                if(data[ext]) throw new DataError({ message: "File already exists.", date: { file: filepath }});
                
                let promises = this.readFile(filepath, ext).then(content => {
                    data[ext] = content;
                });
                promises.push(promises);
            };
            return Promise.all(promises).then(lock.resolve).catch(lock.reject);
        });

        lock.wait();
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