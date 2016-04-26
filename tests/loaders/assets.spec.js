/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const AssetsLoader = require("../../lib/loaders/assets");
const Q = require('q');

describe("assetsLoader", function () {

    it("load", function (done) {
        
        return Q.try(function() {

            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            return new AssetsLoader($qwebs, $config, $router).load().then(function(assets) {
                expect(assets.length).toEqual(2);            
                expect(assets[0].route).toEqual("/assets/user.svg");
                expect(assets[1].route).toEqual("/main.html");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
