/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Asset = require('../../lib/routes/asset');
const Q = require('q');

describe("injector", function () {

    it("create", function (done) {
        return Q.try(function() {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            let asset = new Asset($qwebs, $config, "/api");
        }).catch(function (error) {
            expect(error.message).toBeNull();
        }).finally(done);
    });
    
    it("create empty route", function (done) {
        return Q.try(function() {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            let asset = new Asset($qwebs, $config, null);
        }).catch(function (error) {
            expect(error.message).toEqual("Route is not defined.");
        }).finally(done);
    });
    
    it("invoke", function (done) {
        return Q.try(function() {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            let asset = new Asset($qwebs, $config, "/api");
            let request = {
                url: "/api"
            };
            let response = {
                
            };
            return asset.invoke(request, response);
            
        }).then(function(data) {
            expect(data).not.toBeNull();
            
        }).catch(function (error) {
            expect(error.message).toEqual("Content is empty"); //TODO
        }).finally(done);
    });
});