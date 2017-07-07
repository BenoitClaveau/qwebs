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
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).catch(error => {
                        return response.send({ statusCode: 500, request: request, content: error }); //close request
                    });
                }).listen(1337);
                
                let $client = $qwebs.resolve("$client");
                return $client.post({ url: "http://localhost:1337/save", json: { login: "test" }}).then(res => {
                    expect(res.body.status).toBe("saved");
                });
            });
        }).catch(fail).then(() => {
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
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).catch(error => {
                        return response.send({ statusCode: 500, request: request, content: error }); //close request
                    });
                }).listen(1337);
                
                let $client = $qwebs.resolve("$client");
                return $client.post({ url: "http://localhost:1337/save", formData: { 
                    login: "test",
                    file: fs.createReadStream(__dirname + '/../services/images/world.png'),
                }});
            });
        }).catch(fail).then(() => {
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
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).catch(error => {
                        return response.send({ statusCode: 500, request: request, content: error }); //close request
                    });
                }).listen(1337);
                
                let $client = $qwebs.resolve("$client");
                return $client.post({ url: "http://localhost:1337/save", form: { login: "test" }});
            });
        }).catch(fail).then(() => {
            if (server) server.close();
            done();
        });
    });
});
