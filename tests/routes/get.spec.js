/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
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
                        return $qwebs.invoke(request, response).catch(reject).then(() => {
                            response.send({ request: request }); //close request
                        });
                    }).listen(1337);
                });
                
                let $client = $qwebs.resolve("$client");
                let request = $client.get({ url: "http://localhost:1337/get" }).then(res => {
                    expect(res.whoiam).toBe("I'm Info service.");
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
