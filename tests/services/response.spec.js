/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");

describe("response", () => {

    it("redirect", done => {
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

    it("gzip", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./info");
            $qwebs.get("/get", "$info", "getInfo");
            
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
                let request = $client.get({ url: "http://localhost:1337/get", gzip: true }).then(res => {
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

    it("deflate", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./info");
            $qwebs.get("/get", "$info", "getInfo");
            
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
                
                let request = new Promise((resolve, reject) => {
                    http.get({ host: 'localhost', path: '/get', port: 1337, headers: { 'accept-encoding': 'deflate' } })
                      .on('response', response => {
                          let buffer = "";
                          response.pipe(zlib.createInflate())
                            .on('data', data => {
                                buffer += data.toString();
                            }).on('end', () => {
                                resolve(JSON.parse(buffer);
                            }).on('error', reject);
                      }).on('error', reject);                    
                }).then(body => {
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

    it("etag", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./info");
            $qwebs.get("/get", "$info", "getInfo");
            
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
                let request = $client.get({ url: "http://localhost:1337/get" }).then(res1 => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => resolve(), 1000);
                    }).then(() => {
                        return $client.get({ url: "http://localhost:1337/get" }).then(res2 => {
                            expect(res1.headers.date).not.toBe(res2.headers.date);
                            expect(res1.headers.etag).toBe(res2.headers.etag);
                        });
                    });
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
