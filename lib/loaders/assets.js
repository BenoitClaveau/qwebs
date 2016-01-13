/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var walk = require("./../utils/walk"),
    Asset = require("./../routes/asset"),
    fs = require("fs"),
    path = require("path"),
    DataError = require("./../dataerror"),
    Q = require('q');

function AssetsLoader (){
};

AssetsLoader.prototype.constructor = AssetsLoader;

AssetsLoader.prototype.load = function($qwebs) {
    
    var $config = $qwebs.resolve("$config");
    var $router = $qwebs.resolve("$router");
        
    return Q.try(function() {

        if(!$config.folder) return [];
        
        $config.folder = path.resolve($qwebs.root, $config.folder);
    
        return Q.nfcall(fs.stat, $config.folder).then(function(stat) {
            var promises = [];
            
            var files = walk.get($config.folder);
            for (var i in files) {
                var filepath = files[i];
                var route = filepath.substring($config.folder.length);
                var asset = new Asset($qwebs, $config, route);
                promises.push(asset.initFromFiles([filepath]));
            };
            return Q.all(promises);
            
        }).then(function(assets) {
         
            return $router.assets(assets); 
            
        }).catch(function(error) {
         
            throw new DataError({ message: "Failed to load public folder : " + $config.folder + ". "  + error.message });
        });
    });
};

exports = module.exports = new AssetsLoader();
