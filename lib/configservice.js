/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var fs = require("fs"),
    Q = require('q');

function ConfigService (){
};

ConfigService.prototype.constructor = ConfigService;

ConfigService.prototype.load = function(filepath) {
    filepath = filepath || "./config.json";
    
    return Q.nfcall(fs.readFile, filepath, "utf-8").then(function(str) {
        var config = JSON.parse(str);
        if (config.compress == null) config.compress = true;
        if (config.verbose == null) config.verbose = false;
        if (config.folder == undefined) config.folder = 'public';
        
        return config
    });
};

exports = module.exports = new ConfigService();