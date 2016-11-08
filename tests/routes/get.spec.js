/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");
const request = require('request');

describe("get", () => {

    it("get", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.get("/get", "$info", "getInfo");

            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(res => {
                            expect(res.whoiam).toBe("I'm Info service.");
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                $client.get({ url: "http://localhost:1337/get" });
                return promise;
            });
        }).catch(error => {
            expect(error.stack + JSON.stringify(error.data)).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
});
