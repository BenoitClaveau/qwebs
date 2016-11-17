/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const AssetsLoader = require("../../lib/loaders/assets");
const http = require("http");

describe("assetsLoader", () => {

    it("Load", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            return new AssetsLoader($qwebs, $config, $router).load().then(assets => {
                expect(assets.length).toEqual(2);            
                expect(assets[0].route).toEqual("/assets/user.svg");
                expect(assets[1].route).toEqual("/main.html");
            });
            
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("Failed to read public folder", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public0" }});
            let $config = $qwebs.resolve("$config");
            let $router = $qwebs.resolve("$router");
            
            return new AssetsLoader($qwebs, $config, $router).load().catch(error => {
                expect(error.message).toEqual("Failed to read public folder.");            
            });            
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("Invoke", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            
            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(resolve).catch(reject);
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.get({ url: "http://localhost:1337/assets/user.svg" }).then(res => {
                    expect(res).toBeDefined();
                });
                return Promise.all([promise, request]);
            });
        }).catch(error => {
            expect(error.stack + JSON.stringify(error.data)).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
    
    it("Invoke cache-manifest", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            
            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(resolve).catch(reject);
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.get({ url: "http://localhost:1337/assets/user.svg", headers: { 'content-type': 'cache-manifest' }}).then(res => {
                    console.log(res)
                    expect(res).toBeDefined();
                });
                return Promise.all([promise, request]);
            });
        }).catch(error => {
            expect(error.stack + JSON.stringify(error.data)).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
});
