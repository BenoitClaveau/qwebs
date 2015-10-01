/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Q = require("q"),
    path = require("path"),
    walk = require("./../utils/walk.js"),
    fs = require("fs"),
    DataError = require("./../dataerror");

function Repository(folder) {
    if (!folder) throw new DataError({ message: "Unknown folder " + folder });
    
    var files = walk.get(folder);
    for (var i in files) {
        var filepath = files[i];
        
        var route = filepath.substring(folder.length);
        var ext = path.extname(route).substr(1); //get extension without .
        route = route.slice(0, -(ext.length + 1)); //get file name withous extension and .
        var routes = route.split("/");
        
        var data = this;
        for (var j in routes) {
            var token = routes[j];
            if(!token) continue; //if filepath start with /
            data[token] = data[token] || {};
            data = data[token];
        }
        
        //TODO change encoding according to the extension
        if(data[ext]) throw new DataError({ message: "File already exists." });
        data[ext] = fs.readFileSync(filepath, "utf8");
    };
};

exports = module.exports = {
    create: function(folder) {
        return new Repository(folder);
    }
};