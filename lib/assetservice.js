/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var walk = require("./walk"),
    Asset = require("./asset"),
    Q = require("q"),
    fs = require("fs"),
    DataError = require("./dataerror");

function AssetService () {
    this.AssetService = [];
};

AssetService.prototype.add = function(asset) {
    this.AssetService.push(asset);
    return asset;
}

AssetService.prototype.load = function(dir) {
    dir = dir || "./public";
    var self = this;
    
    return Q.nfcall(fs.stat, dir).then(function(stat) {
        var promises = [];
        
        var files = walk.get(dir);
        for (var i in files) {
            var filepath = files[i];
            var route = filepath.substring(dir.length);
            var asset = self.add(new Asset(route));
            promises.push(asset.initFromFiles([filepath]));
        };
        return promises;
    }).then(function(promises) {
        return Q.all(promises);
    }).catch(function(error) {
        console.log("[AssetService]", error);
    });
};

AssetService.prototype.get = function(route) {
    if (route == undefined) throw new DataError({ message: "Undefined asset route" });

    for (var i in this.AssetService) {
        var asset = this.AssetService[i];

        if (asset.route == route) return asset;
    };
    return null;
};

AssetService.prototype.match = function(request, response) {
    return this.get(request.url) != undefined;
};

AssetService.prototype.invoke = function(request, response) {
    if (!request) throw new DataError({ message: "Request is undefined" });
    if (!response) throw new DataError({ message: "Response is undefined" });
    if (!request.url) throw new DataError({ message: "Request.url is undefined" });
    
    var asset = this.get(request.url);
    if (!asset) throw new DataError({ message: "Unknown asset: " + request.url });

    var header = null;
    if (asset.contentType.match(/text\/cache-manifest/ig)) {
        header = {
            "Content-Type": asset.contentType,
            "Cache-Control": "no-cache",
            "Expires": new Date(Date.now()).toString()
        };
    }
    else {
        header = {
            "Content-Type": asset.contentType,
            "Expires": new Date(Date.now() + 604800000).toString(), /* 1000 * 60 * 60 * 24 * 7 (7 jours)*/
            "Etag": "\"" + asset.atime + "\""
        };
    }

    return response.send({
        header: header,
        request: request,
        content: asset.content,
        contentGzip: asset.contentGzip,
        contentDeflate: asset.contentDeflate
        //}).then(function() {
        //    console.log("Invoke asset: " + asset.toString());
    }).catch(function(error) {
        throw new DataError({ message: "Failed to send: " + asset.toString(), error: error });
    });
};

exports = module.exports = new AssetService();