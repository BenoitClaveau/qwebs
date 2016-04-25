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
const Q = require('q');

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
        var self = this;
           
        return Q.try(function() {
            var filepath = self.$config.bundle;
            if(!filepath || filepath == false) return [];

            if (typeof filepath == "string") 
            {
                try {
                    filepath = path.resolve(self.$qwebs.root, filepath);
                    return Q.ninvoke(fs, "readFile", filepath).then(function(str) {
                        try {
                            return JSON.parse(str);
                        }
                        catch(error) {
                            throw new DataError({ message: "Failed to parse the bundle file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                        }
                    });
                }
                catch(error) {
                    throw new DataError({ message: "Failed to read the bundle file.", data: { error: error.message, filepath: filepath }, stack: error.stack });
                }
            }
            else if (filepath instanceof Object) return filepath;
            else throw new DataError({ message: "Bundle type is not managed." });
            
        }).then(function(bundles) {
            var promises = [];
            for (var property in bundles) {
                var files = bundles[property];
                var asset = new Asset(self.$qwebs, self.$config, property);
                promises.push(asset.initFromFiles(files));
            };
            
            return Q.all(promises);
            
        }).then(function(assets) {
            return self.$router.assets(assets);
            
        });
    };
};

exports = module.exports = BundleLoader;
