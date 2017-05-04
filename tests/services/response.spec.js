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

describe("request", () => {
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

    it("stream-not-readable", done => {

        // request({ method: 'GET', uri: 'http://localhost:1338/stream-not-readable'}, function (error, response, body) {
        // // body is the decompressed response body
        //     console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
        //     console.log('the decoded data is: ' + body)
        // })
        // .on('data', function(data) {
        //     // decompressed data as it is received
        //     console.log('decoded chunk: ' + data)
        // })
        // .on('response', function(response) {
        //     // unmodified http.IncomingMessage object
        //     response.on('data', function(data) {
        //     // compressed data as it is received
        //         console.log('received ' + data.length + ' bytes of compressed data')
        //         console.log('received ' + data.toString() + ' bytes of compressed data')
        //     })
        // })

        setTimeout(done, 30000)


        // let $client = $qwebs.resolve("$client");
        // $client.get({ url: "http://localhost:1338/stream-not-readable", json: true }).then(res => {
        //     expect(res.body).toEqual("");
        // }).catch(error => {
        //     expect(error.data.response.body).toBe("");
        // }).then(done);
    }, 30000);

    // it("stream", done => {
    //     let $client = $qwebs.resolve("$client");
    //     $client.get({ url: "http://localhost:1338/stream" }).then(res => {
    //         expect(res).toBeNull();
    //     }).catch(error => {
    //         expect(error.data.response.body).toBe('{"message":"_read() is not implemented"}');
    //     }).then(done);
    // }, 60000);
});