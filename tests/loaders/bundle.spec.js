/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const BundleLoader = require("../../lib/loaders/bundle");
const path = require("path");

describe("bundleLoader", () => {
    
    it("load", done => {
        
        return Promise.resolve().then(() => {
            
            let $qwebs = new Qwebs({ dirname: __dirname, config: { bundle: "bundle.json" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");

            return new BundleLoader($qwebs, $config, $router).load().then(assets => {
                expect(assets.length).toEqual(1);
                expect(assets[0].route).toEqual("app.css");
                expect(assets[0].contentType).toEqual("text/css");
            });
            
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("load css", done => {
        
        return Promise.resolve().then(() => {
            
            let $qwebs = new Qwebs({ dirname: __dirname, config: { bundle: "bundle.json" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");

            return new BundleLoader($qwebs, $config, $router).load().then(assets => {
                expect(assets.length).toEqual(1);
                expect(assets[0].route).toEqual("app.css");
                expect(assets[0].contentType).toEqual("text/css");
            });
            
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("load scss", done => {
        
        return Promise.resolve().then(() => {
            
            let $qwebs = new Qwebs({ dirname: __dirname, config: { bundle: "bundle.scss.json" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");

            return new BundleLoader($qwebs, $config, $router).load().then(assets => {
                expect(assets.length).toEqual(1);
                expect(assets[0].route).toEqual("app.css");
                expect(assets[0].contentType).toEqual("text/css");
            });
            
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
});
