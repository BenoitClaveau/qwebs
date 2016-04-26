/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const Asset = require("./../routes/asset");
const DataError = require("./../dataerror");

class BundleLoader {
    constructor($qwebs, $config, $router) {
        if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
        if (!$config) throw new DataError({ message: "Config is not defined." });
        if (!$router) throw new DataError({ message: "Router is not defined." });
        this.$qwebs = $qwebs;  
        this.$config = $config;
        this.$router = $router;
    };
    
    load() {
        return Promise.resolve().then(() => {
            let filepath = this.$config.bundle;
            if(!filepath || filepath == false) return [];
            if (typeof filepath == "string") 
            {
                filepath = path.resolve(this.$qwebs.root, filepath);
                let str;
                try {
                    str = fs.readFileSync(filepath);
                }
                catch(error) {
                    throw new DataError({ message: "Failed to read the bundle file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                } 
                try {
                    return JSON.parse(str);
                }
                catch(error) {
                    throw new DataError({ message: "Failed to parse the bundle file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
            }
            else if (filepath instanceof Object) return filepath;
            else throw new DataError({ message: "Bundle type is not managed." });
        }).then(bundles => {
            let promises = [];
            for (let property in bundles) {
                let files = bundles[property];
                let asset = new Asset(this.$qwebs, this.$config, property);
                promises.push(asset.initFromFiles(files));
            };
            return Promise.all(promises);  
        }).then(assets => {
            return this.$router.assets(assets);
        });
    };
};

exports = module.exports = BundleLoader;
