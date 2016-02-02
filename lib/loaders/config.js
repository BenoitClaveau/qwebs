/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
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

//do not use async function.
ConfigLoader.prototype.create = function($qwebs, filepath) {
	
    if (!$qwebs) throw new DataError({ message: "Qwebs instance is not defined." });
    filepath = filepath || "./config.json";
    
    var config;
    if (typeof filepath == "string") 
    {
        try {
            filepath = path.resolve($qwebs.root, filepath);
            var str = fs.readFileSync(filepath);
            if (!str) throw new DataError({ message: "Configuration file is empty.", data: { filepath: filepath }});
            try {
                config = JSON.parse(str);
            }
            catch(error) {
                throw new DataError({ message: "Failed to parse the configuration file.", data: { error: error.message, filepath: filepath }});
            }
        }
        catch(error){
            throw new DataError({ message: "Failed to read the configuration file.", data: { error: error.message, filepath: filepath }});
        }
    }
    else if (filepath instanceof Object) config = filepath;
    else throw new DataError({ message: "Configuration type is not managed." });
    
    if (config.compress == null) config.compress = true;
    if (config.verbose == null) config.verbose = false;
    
    return config;
};

exports = module.exports = new ConfigLoader();
