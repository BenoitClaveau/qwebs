/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
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
                    return $qwebs.invoke(request, response).then(res => {
                        expect(res.status).toBe("saved");
                    }).catch(error => {
                        expect(error).toBeNull();
                    }).then(() => {
                        done();
                    });
                }).listen(1339);
                
                let $client = $qwebs.resolve("$client");
                return $client.post({ url: "http://localhost:1339/save", json: { login: "test" }});
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
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).then(res => {
                        expect(res.status).toBe("saved");
                    }).catch(error => {
                        console.error(error)
                        expect(error).toBeNull();
                    }).then(() => {
                        done();
                    });
                }).listen(1342);
                
                let $client = $qwebs.resolve("$client");
                return $client.post({ url: "http://localhost:1342/save", formData: { 
                    login: "test",
                    file: fs.createReadStream(__dirname + '/../services/images/world.png'),
                }});
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
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).then(res => {
                        expect(res.status).toBe("saved");
                    }).catch(error => {
                        expect(error).toBeNull();
                    }).then(() => {
                        done();
                    });
                }).listen(1343);
                
                let $client = $qwebs.resolve("$client");
                return $client.post({ url: "http://localhost:1343/save", form: { login: "test" }});
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
});
