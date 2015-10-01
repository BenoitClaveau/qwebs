/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var fs = require("fs"),
    path = require("path"),
    Asset = require("./../routes/asset"),
    DataError = require("./../dataerror"),
    Q = require('q');

function BundleLoader (){
};

BundleLoader.prototype.constructor = BundleLoader;

BundleLoader.prototype.load = function(qwebs) {
    
    var config = qwebs.injector.resolve("$config");
    
    return Q.try(function() {
        if(!config.bundle) return [];
        
        config.bundle = path.resolve(qwebs.root, config.bundle);
        
        return Q.nfcall(fs.stat, config.bundle).then(function(stat) {
            return Q.nfcall(fs.readFile, config.bundle, "utf-8").then(function(str) {
                return JSON.parse(str);
            }).then(function(bundles) {
                var promises = [];
                for (var property in bundles) {
                    var files = bundles[property];
                    var asset = new Asset(config, property);
                    promises.push(asset.initFromFiles(files));
                };
                return Q.all(promises);
            });
        }).catch(function(error) {
            throw new DataError({ message: "Failed to read the bundle configuration file: " + config.bundle, error: error });
        });
    });
};

exports = module.exports = new BundleLoader();