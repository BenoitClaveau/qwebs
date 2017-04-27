/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");
const request = require('request');
const fs = require('fs');

describe("post", () => {

    it("post json", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.post("/save", "$info", "save");

            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(resolve).catch(reject).then(() => {
                            response.send({ request: request }); //close request
                        });
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.post({ url: "http://localhost:1337/save", json: { login: "test" }}).then(res => {
                    expect(res.status).toBe("saved");
                });
                return Promise.all([promise, request]);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });

    it("post form-data", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.post("/save", "$info", "save");

            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(resolve).catch(reject).then(() => {
                            response.send({ request: request }); //close request
                        });
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.post({ url: "http://localhost:1337/save", formData: { 
                    login: "test",
                    file: fs.createReadStream(__dirname + '/../services/images/world.png'),
                }});
                return Promise.all([promise, request]);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });

    it("post x-www-form-urlencoded", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.post("/save", "$info", "save");

            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(resolve).catch(reject).then(() => {
                            response.send({ request: request }); //close request
                        });
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.post({ url: "http://localhost:1337/save", form: { login: "test" }});
                return Promise.all([promise, request]);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
});
