/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");
const request = require('request');

describe("put", () => {

    it("put", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.put("/update", "$info", "update");

            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(res => {
                            expect(res.status).toBe("updated");
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    }).listen(1337);
                });

                let $client = $qwebs.resolve("$client");
                $client.put({ url: "http://localhost:1337/update", json: { login: "test" }});
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
