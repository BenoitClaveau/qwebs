/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const BundleLoader = require("../../lib/loaders/bundle");
const path = require("path");
const Q = require('q');

describe("bundleLoader", function () {
    
    it("load", function (done) {
        
        return Q.try(function() {
            
            let $qwebs = new Qwebs({ dirname: __dirname, config: { bundle: "./bundle.json" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");

            return new BundleLoader($qwebs, $config, $router).load().then(function(assets) {
                expect(assets.length).toEqual(1);
                expect(assets[0].route).toEqual("app.css");
                expect(assets[0].contentType).toEqual("text/css");
            });
            
        }).catch(function (error) {
            expect(error).toBeNull();
        }).finally(done);
    });
});
