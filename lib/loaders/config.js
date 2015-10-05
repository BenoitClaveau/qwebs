/*!
 * qwebs
 * Copyright(c) 2015 BenoÃ®t Claveau
 * MIT Licensed
 */
 
"use strict";

var fs = require("fs"),
    path = require("path"),
    DataError = require("./../dataerror"),
    Q = require("q");

function ConfigLoader (){
};

ConfigLoader.prototype.constructor = ConfigLoader;

ConfigLoader.prototype.create = function(qwebs, filepath) {
	if (!qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
    
	filepath = filepath || path.resolve(qwebs.root, "./config.json");
    var config;
    if (typeof filepath == "string") 
    {
        try {
            config = require.main.require(filepath);
        }
        catch(error){
            throw new DataError({ message: "Failed to read the configuration file: " + filepath, error: error });
        }
    }
    else if (filepath instanceof Object) config = filepath;
    else throw new DataError({ message: "Configuration type is not managed." });
    
    if (config.compress == null) config.compress = true;
    if (config.verbose == null) config.verbose = false;
    
    return config;
};

exports = module.exports = new ConfigLoader();