/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var fs = require("fs"),
    DataError = require("./dataerror"),
    Q = require('q');

function BundleService (){
};

BundleService.prototype.constructor = BundleService;

BundleService.prototype.load = function(qwebs, filepath) {
    filepath = filepath || "./bundle.json";
    
    return Q.nfcall(fs.stat, filepath).then(function(stat) {
        return Q.nfcall(fs.readFile, filepath, "utf-8").then(function(str) {
            return JSON.parse(str);
        });
    }).catch(function(error) {
        throw new DataError({ message: "Failed to read the bundle configuration file: " + filepath, error: error });
    });
};

exports = module.exports = new BundleService();