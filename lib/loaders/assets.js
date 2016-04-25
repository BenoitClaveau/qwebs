/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const walk = require("./../utils/walk");
const Asset = require("./../routes/asset");
const fs = require("fs");
const path = require("path");
const DataError = require("./../dataerror");
const Q = require('q');

class AssetsLoader {
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

            if(!self.$config.folder || self.$config.folder == false) return [];
            
            self.$config.folder = path.resolve(self.$qwebs.root, self.$config.folder);
        
            return Q.nfcall(fs.stat, self.$config.folder).then(function(stat) {
                var promises = [];
                
                var files = walk.get(self.$config.folder);
                for (var i in files) {
                    var filepath = files[i];
                    var route = filepath.substring(self.$config.folder.length);
                    var asset = new Asset(self.$qwebs, self.$config, route);
                    promises.push(asset.initFromFiles([filepath]));
                };
                return Q.all(promises);
            }).then(function(assets) {
                return self.$router.assets(assets); 
            }).catch(function(error) {
                if (error.name === "DataError") throw error;
                throw new DataError({ message: "Failed to read public folder.", data: { error: error.message }, stack: error.stack });
            });
        });
    };
};

exports = module.exports = AssetsLoader;
