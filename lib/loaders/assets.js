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

AssetsLoader.prototype.load = function(qwebs) {
    
    var config = qwebs.injector.resolve("$config");
    
    //TODO check if config folder is a file path or an object
    config.folder = config.folder || "./public";
    config.folder = path.resolve(qwebs.root, config.folder);

    return Q.nfcall(fs.stat, config.folder).then(function(stat) {
        var promises = [];
        
        var files = walk.get(config.folder);
        for (var i in files) {
            var filepath = files[i];
            var route = filepath.substring(config.folder.length);
            //var asset = self.add();
            var asset = new Asset(config, route);
            promises.push(asset.initFromFiles([filepath]));
        };
        return promises;
    }).then(function(promises) {
        return Q.all(promises);
    }).catch(function(error) {
        throw new DataError({ message: "Failed to load public folder : " + config.folder, error: error });
    });
};

exports = module.exports = new AssetsLoader();