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
const JSONStream = require('JSONStream');
const Readable = require('stream').Readable;

describe("reponse", () => {
    let server;

    beforeAll(function(done) {
        process.on('unhandledRejection', (err, p) => {
            console.error(err)
        });

        let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
        $qwebs.inject("$info", "../services/info");
        $qwebs.get("/stream", "$info", "getStream");
        $qwebs.get("/stream-with-string", "$info", "getStreamWithString");
        $qwebs.get("/stream-multiple-types", "$info", "getStreamMultipleTypes");
        $qwebs.get("/stream-error", "$info", "getStreamError");
        $qwebs.get("/stream-error-after-sending", "$info", "getStreamErrorAfterSending");
        
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

    it("JSON", done => {
        let server = http.createServer((request, response) => {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end('{ "id": 3 }');
            server.close();
        }).listen(1339, () => {
            request({ method: 'GET', uri: 'http://localhost:1339', json: true }, (error, response, body) => {
                expect(error).toBeNull();
                expect(body.id).toBe(3);
                done();
            });
        });
    });


    it("Send object instead of json", done => {
        let server = http.createServer((request, response) => {
            try {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end({ "id": 3 });
            } 
            catch(error) {
                expect(error.message).toBe("First argument must be a string or Buffer");
                server.close();
                done();
            }
        }).listen(1339, () => {
            request({ method: 'GET', uri: 'http://localhost:1339', json: true }, (error, response, body) => {
                expect(true).toBe(false);
            });
        });
    });

    it("JSON stream", done => {
        let server = http.createServer((request, response) => {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write("[");
            response.write('{ "id": 1 }');
            response.write(',');
            response.write('{ "id": 2 }');
            response.write(']');
            response.end();
            server.close();
        }).listen(1339, () => {
            request({ method: 'GET', uri: 'http://localhost:1339', json: true }, (error, response, body) => {
                expect(error).toBeNull();
                expect(body.length).toBe(2);
                expect(body[0].id).toBe(1);
                expect(body[1].id).toBe(2);
                done();
            });
        });
    });

    it("JSON stream like JSONStream", done => {
        let server = http.createServer((request, response) => {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write("[\n");
            response.write('{ "id": 1 }');
            response.write('\n,\n');
            response.write('{ "id": 2 }');
            response.write('\n]\n');
            response.end();
            server.close();
        }).listen(1339, () => {
            request({ method: 'GET', uri: 'http://localhost:1339', json: true }, (error, response, body) => {
                expect(error).toBeNull();
                expect(body.length).toBe(2);
                expect(body[0].id).toBe(1);
                expect(body[1].id).toBe(2);
                done();
            });
        });
    });

    it("JSON stream like Qwebs", done => {
        let server = http.createServer((request, response) => {
            const stream = Readable({objectMode: true}); 
		    stream._read = () => {};
            response.writeHead(200, {
                "Cache-Control":"no-cache",
                "Content-Type":"application/json; charset=utf-8",
                "Date":"Fri, 05 May 2017 08:50:54 GMT",
                "Expires":"Fri, 05 May 2017 08:50:54 GMT",
                "Last-Modified":"Fri, 05 May 2017 08:50:54 GMT",
                "Transfer-Encoding":"chunked",
                "Vary":"Accept-Encoding"
            });

            stream.pipe(JSONStream.stringify()).pipe(response);
            stream.push({ id: 1 });
            stream.push({ id: 2 });
            stream.push(null);
            server.close();
        }).listen(1339, () => {
            request({ method: 'GET', uri: 'http://localhost:1339', json: true }, (error, response, body) => {
                expect(error).toBeNull();
                expect(body.length).toBe(2);
                expect(body[0].id).toBe(1);
                expect(body[1].id).toBe(2);
                done();
            });
        });
    });
    
    it("Qwebs JSON stream", done => {
        request({ method: 'GET', uri: 'http://localhost:1338/stream', json: true }, (error, response, body) => {
            expect(error).toBeNull();
            expect(body.length).toBe(2);
            expect(body[0].id).toBe(1);
            expect(body[1].id).toBe(2);
            done();
        });
    });

    it("JSON stream like Qwebs push string", done => {
        let server = http.createServer((request, response) => {
            const stream = Readable({objectMode: true}); 
		    stream._read = () => {};
            response.writeHead(200, {
                "Cache-Control":"no-cache",
                "Content-Type":"application/json; charset=utf-8",
                "Date":"Fri, 05 May 2017 08:50:54 GMT",
                "Expires":"Fri, 05 May 2017 08:50:54 GMT",
                "Last-Modified":"Fri, 05 May 2017 08:50:54 GMT",
                "Transfer-Encoding":"chunked",
                "Vary":"Accept-Encoding"
            });

            stream.pipe(JSONStream.stringify()).pipe(response);
            stream.push("{ id: 1 }");
            stream.push("{ id: 2 }");
            stream.push(null);
            server.close();
        }).listen(1339, () => {
            request({ method: 'GET', uri: 'http://localhost:1339', json: true }, (error, response, body) => {
                expect(error).toBeNull();
                expect(body.length).toBe(2);
                expect(typeof body[0]).toBe("string");
                expect(typeof body[1]).toBe("string");
                done();
            });
        });
    });

    it("Qwebs JSON stream with string", done => {
        request({ method: 'GET', uri: 'http://localhost:1338/stream-with-string', json: true }, (error, response, body) => {
            expect(error).toBeNull();
            expect(body.length).toBe(2);
            expect(typeof body[0]).toBe("string");
            expect(typeof body[1]).toBe("string");
            done();
        });
    });

    it("Qwebs JSON stream with multiple-types", done => {
        request({ method: 'GET', uri: 'http://localhost:1338/stream-multiple-types', json: true }, (error, response, body) => {
            expect(error).toBeNull();
            expect(body.length).toBe(3);
            expect(typeof body[0]).toBe("string");
            expect(body[1].id).toBe(2);
            expect(body[2]).toBe(33);
            done();
        });
    });

    it("Qwebs JSON stream error", done => {
        request({ method: 'GET', uri: 'http://localhost:1338/stream-error', json: true }, (error, response, body) => {
            expect(error).toBeNull();
            expect(response.statusCode).toBe(500);
            expect(body.message).toBe("Error in stream.");
            done();
        });
    });
    
    it("Qwebs JSON stream error after sending", done => {
        request({ method: 'GET', uri: 'http://localhost:1338/stream-error-after-sending'}, function (error, response, body) {
            expect(error.code).toBe("HPE_INVALID_CHUNK_SIZE");
            expect(response).toBeUndefined();
            expect(body).toBeUndefined();
            done();
        })
        .on('data', function(data) {
            console.log('response chunk:', data.toString());
        })
        .on('response', function(response) {
            response.on('data', function(data) {
                console.log('received', data.length, 'bytes of data', data.toString());
            }).on('error', function(error) {
                console.error("response error", error);
            });
        })
    }, 60000);
});