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
    fs = require("fs"),
    Q = require('q');

function BundleLoader (){
};

BundleLoader.prototype.constructor = BundleLoader;

BundleLoader.prototype.load = function($qwebs) {
    
    if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
    
    var $config = $qwebs.resolve("$config");
    var $router = $qwebs.resolve("$router");
        
    return Q.try(function() {
        var filepath = $config.bundle;
        if(!filepath || filepath == false) return [];

        if (typeof filepath == "string") 
        {
            try {
                filepath = path.resolve($qwebs.root, filepath);
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
            var asset = new Asset($qwebs, $config, property);
            promises.push(asset.initFromFiles(files));
        };
        
        return Q.all(promises);
        
    }).then(function(assets) {
        return $router.assets(assets);
        
    });
     
};

exports = module.exports = new BundleLoader();
