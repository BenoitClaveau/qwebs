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
        return Promise.resolve().then(() => {
            if(!this.$config.folder || this.$config.folder == false) return [];
            this.$config.folder = path.resolve(this.$qwebs.root, this.$config.folder);

            let stat;
            try {
                stat = fs.statSync(this.$config.folder);
            }
            catch (error) {
                throw new DataError({ message: "Failed to read public folder.", data: { error: error.message }, stack: error.stack });
            }

            let promises = [];
            let files = walk.get(this.$config.folder);
            for (let i in files) {
                let filepath = files[i];
                let route = filepath.substring(this.$config.folder.length);
                let asset = new Asset(this.$qwebs, this.$config, route);
                promises.push(asset.initFromFiles([filepath]));
            };
            return Promise.all(promises).then(assets => {
                return this.$router.assets(assets);
            });
        });
    };
};

exports = module.exports = AssetsLoader;
