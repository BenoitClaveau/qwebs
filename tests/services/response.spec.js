/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");

describe("get", () => {

    it("get", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./info");
            $qwebs.get("/get", "$info", "getInfo");
            $qwebs.get("/redirect", "$info", "redirect");
            
            return $qwebs.load().then(() => {
                let promise = new Promise((resolve, reject) => {
                    server = http.createServer((request, response) => {
                        return $qwebs.invoke(request, response).then(res => {
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.get({ url: "http://localhost:1337/redirect" }).then(res => {
                    expect(res.body.whoiam).toBe("I'm Info service.");
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
