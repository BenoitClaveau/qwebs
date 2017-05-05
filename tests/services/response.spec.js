/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");
const request = require('request');
const process = require('process');

describe("response", () => {
    let $qwebs;
    let server;

    beforeAll(function(done) {
        process.on('unhandledRejection', (err, p) => {
            console.log(err)
        });

        $qwebs = new Qwebs({ dirname: __dirname, config: {}});
        $qwebs.inject("$info", "../services/info");
        $qwebs.get("/stream", "$info", "getStream");
        $qwebs.get("/stream-not-readable", "$info", "getStreamNotReadable");

        return $qwebs.load().then(() => {
            server = http.createServer((request, response) => {
                return $qwebs.invoke(request, response).catch(error => {
                    response.send({ statusCode: 500, request: request, content: { message: error.message }});
                });
            }).listen(1338);
            done();
        });
    });

    afterAll(function() {
        if (server) server.close();
    });

    it("stream", done => {
        let $client = $qwebs.resolve("$client");
        $client.get({ url: "http://localhost:1338/stream" }).then(res => {
            expect(res).toBeNull();
        }).catch(error => {
            expect(error.data.response.body).toBe('{"message":"_read() is not implemented"}');
        }).then(done);
    }, 60000);

    it("stream", done => {
        let $client = $qwebs.resolve("$client");
        $client.get({ url: "http://localhost:1338/stream" }).then(res => {
            expect(res).toBeNull();
        }).catch(error => {
            expect(error.data.response.body).toBe('{"message":"_read() is not implemented"}');
        }).then(done);
    }, 60000);

});