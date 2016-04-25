"use strict";

const Qwebs = require("../../lib/qwebs");
const BundleLoader = require("../../lib/loaders/bundle");
const path = require("path");
const Q = require('q');

describe("bundleLoader", function () {
    
    it("load", function (done) {
        
        return Q.try(function() {
            
            let cfg = {
                bundle: "./bundle.json"
            };
        
            let $qwebs = new Qwebs({ dirname: __dirname, config: cfg });
        
            return new BundleLoader($qwebs, $qwebs.resolve("$config"), $qwebs.resolve("$router")).load().then(function(assets) {
                expect(assets.length).toEqual(1);
                expect(assets[0].route).toEqual("app.css");
                expect(assets[0].contentType).toEqual("text/css");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
