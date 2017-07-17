/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");
const request = require('request');


describe("proxy", () => {
    let server;

    beforeAll(function(done) {
        process.on('unhandledRejection', (err, p) => {
            console.error(err)
        });

        const config = {
            proxy: {
                hosts: {
                    "localhost:1338": {
                        target: "http://localhost:1338/proxy"
                    }
                }
            }
        }

        let $qwebs = new Qwebs({ dirname: __dirname, config: config });
        $qwebs.inject("$proxy", "./proxy"); //override proxy to remove config after first forward.
        $qwebs.inject("$info", "./info");
        $qwebs.get("/proxy", "$info", "getMessage");
        
        return $qwebs.load().then(() => {
            server = http.createServer((request, response) => {
                return $qwebs.invoke(request, response).catch(error => {
                    response.send({ statusCode: 500, request: request, content: { message: error.message }});
                });
            }).listen(1338, done);
        });
    });

    afterAll(function() {
        if (server) server.close();
    });

    it("Get", done => {
        request({ method: 'GET', uri: 'http://localhost:1338', json: true }, (error, response, body) => {
            expect(error).toBeNull();
            expect(body.text).toBe("hello world");
            done();
        });
    });
});