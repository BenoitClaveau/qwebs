/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var walk = require('./walk'),
    Asset = require('./asset'),
    Q = require('q');

function Assets () {
    this.assets = [];
};

Assets.prototype = {
    add: function (asset) {
        this.assets.push(asset);
        return asset;
    },
    load: function (dir) {
        var self = this;
        return Q.try(function () {
            var promises = [];
            var files = walk.get(dir);
            for (var i in files) {
                var filepath = files[i];
                var route = filepath.substring(dir.length);
                var asset = self.add(new Asset(route));
                promises.push(asset.initFromFiles([filepath]));
            };
            return promises;
        }).then(function (promises) {
            return Q.all(promises);
        });
    },
    get: function (route) {
        if (route == undefined) throw new Error("Undefined asset route");

        //TODO à améliorer
        for (var i in this.assets) {
            var asset = this.assets[i];

            if (asset.route == route) return asset;
        };
        return null;
    },
    match: function (request, response) {
        return this.get(request.url) != undefined;
    },
    invoke: function (request, response) {
        if (!request) throw new Error("Request is undefined");
        if (!response) throw new Error("Response is undefined");
        if (!request.url) throw new Error("Request.url is undefined");
        var asset = this.get(request.url);
        if (!asset) throw new Error("Unknown asset: " + request.url);

        var header = null;
        if (asset.contentType.match(/text\/cache-manifest/ig)) {
            header = {
                'Content-Type': asset.contentType,
                'Cache-Control': 'no-cache',
                'Expires': new Date(Date.now()).toString()
            };
        }
        else {
            header = {
                'Content-Type': asset.contentType,
                'Expires': new Date(Date.now() + 604800000).toString(), /* 1000 * 60 * 60 * 24 * 7 (7 jours)*/
                'Etag': '"' + asset.atime + '"'
            };
        }

        return response.send({
            header: header,
            request: request,
            content: asset.content,
            contentGzip: asset.contentGzip,
            contentDeflate: asset.contentDeflate
            //}).then(function () {
            //    console.log("Invoke asset: " + asset.toString());
        }).catch(function (err) {
            throw new Error(asset.toString(), err);
        });
    }
};

exports = module.exports = new Assets();