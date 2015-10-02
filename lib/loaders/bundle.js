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
    if (!qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
    var $config = qwebs.resolve("$config");
    
    return Q.try(function() {

        var filepath = $config.bundle;
        if (!filepath) return []
        
        if (typeof filepath == "string") 
        {
            try {
                return require.main.require(filepath);
            }
            catch(error){
                throw new DataError({ message: "Failed to read the bundle file: " + filepath, error: error });
            }
        }
        else if (filepath instanceof Object) return filepath;
        else throw new DataError({ message: "Bundle type is not managed." });
        
    }).then(function(bundles) {
        var promises = [];
        for (var property in bundles) {
            var files = bundles[property];
            var asset = new Asset($config, property);
            promises.push(asset.initFromFiles(files));
        };
        return Q.all(promises);
    });
};

exports = module.exports = new BundleLoader();