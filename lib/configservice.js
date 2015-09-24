/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var fs = require("fs"),
    DataError = require("./dataerror"),
    Q = require("q");

function ConfigService (){
};

ConfigService.prototype.constructor = ConfigService;

ConfigService.prototype.create = function(filepath) {
    filepath = filepath || "./config.json";
    
    var config;
    if (typeof filepath == "string") {
        try {
            config = JSON.parse(fs.readFileSync(filepath));
        }
        catch(error){
            throw new DataError({ message: "Failed to read the configuration file: " + filepath, error: error });
        }
    }
    else if (filepath instanceof Object) config = filepath;
    else throw new DataError({ message: "Type is not managed." });
    
    if (config.compress == null) config.compress = true;
    if (config.verbose == null) config.verbose = false;
    if (config.folder == undefined) config.folder = "./public";
    if (config.bundle == undefined) config.bundle = "./bundle.json";
    
    return config;
};

exports = module.exports = new ConfigService();