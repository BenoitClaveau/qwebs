/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Asset = require('../../lib/routes/asset');
const http = require("http");

describe("asset", () => {

    it("create", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: false }});
            return $qwebs.load().then(() => {
                let $config = $qwebs.resolve("$config");
                let $router = $qwebs.resolve("$router");
                
                let asset = new Asset($qwebs, $config, "/api");
            });
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("create empty route", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: false }});
            return $qwebs.load().then(() => {
                let $config = $qwebs.resolve("$config");
                let $router = $qwebs.resolve("$router");
                
                let asset = new Asset($qwebs, $config, null);
            });
        }).catch(error => {
            expect(error.message).toEqual("Route is not defined.");
        }).then(() => {
            done();
        });
    });
    
    it("invoke", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: false }});
            return $qwebs.load().then(() => {
                let $config = $qwebs.resolve("$config");
                let $router = $qwebs.resolve("$router");
                
                let asset = new Asset($qwebs, $config, "/api");
                
                let request = new http.IncomingMessage();
                request.url = "/api";
                request.pathname = "/api";
                request.method = "GET";
                let response = new http.ServerResponse(request);
                
                return asset.invoke(request, response);
            });
        }).then(data => {
            expect(data).not.toBeNull(); 
        }).catch(error => {
            expect(error.message).toEqual("Content is empty"); //TODO
        }).then(() => {
            done();
        });
    });
    
    it("bundle css", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            let asset = new Asset($qwebs, $config, "app.css");
            return asset.initFromFile("../loaders/web/components.css", "../loaders/web/master.css");
        }).then((asset) => {
            expect(asset.route).toEqual("app.css");
            expect(asset.contentType).toEqual("text/css");
            expect(asset.content).not.toBeNull();
            expect(asset.contentDeflate).not.toBeNull();
            expect(asset.contentGzip).not.toBeNull();
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("bundle js", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            let asset = new Asset($qwebs, $config, "app.js");
            return asset.initFromFiles("../loaders/web/controller.js");
        }).then((asset) => {
            expect(asset.route).toEqual("app.js");
            expect(asset.contentType).toEqual("application/javascript");
            expect(asset.content).not.toBeNull();
            expect(asset.contentDeflate).not.toBeNull();
            expect(asset.contentGzip).not.toBeNull();
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
});