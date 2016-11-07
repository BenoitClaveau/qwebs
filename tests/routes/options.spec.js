/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Options = require('../../lib/routes/options');
const http = require("http");

describe("options", () => {

    it("*", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            return $qwebs.load().then(() => {
                let $router = $qwebs.resolve("$router");
                let options = new Options($router);
                
                let request = new http.IncomingMessage();
                request.url = "*";
                
                let response = new http.ServerResponse(request);
                
                return options.invoke(request, response).then(res => {
                    expect(res.header.Allow).toBe("GET,POST,PUT,DELETE,HEAD,OPTIONS");
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });

    it("get", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.get("/get", "$info", "getInfo");

            return $qwebs.load().then(() => {
                let $router = $qwebs.resolve("$router");
                let options = new Options($router);

                let request = new http.IncomingMessage();
                request.url = "/get";
                request.pathname = "/get";
                
                let response = new http.ServerResponse(request);
                
                return options.invoke(request, response).then(res => {
                    expect(res.header.Allow).toBe("GET");
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });

    it("post", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.post("/save", "$info", "save");

            return $qwebs.load().then(() => {
                let $router = $qwebs.resolve("$router");
                let options = new Options($router);

                let request = new http.IncomingMessage();
                request.url = "/save";
                request.pathname = "/save";
                
                let response = new http.ServerResponse(request);
                
                return options.invoke(request, response).then(res => {
                    expect(res.header.Allow).toBe("POST");
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });

    it("put", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.put("/update", "$info", "update");

            return $qwebs.load().then(() => {
                let $router = $qwebs.resolve("$router");
                let options = new Options($router);

                let request = new http.IncomingMessage();
                request.url = "/update";
                request.pathname = "/update";
                
                let response = new http.ServerResponse(request);
                
                return options.invoke(request, response).then(res => {
                    expect(res.header.Allow).toBe("PUT");
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });

    it("delete", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.delete("/delete", "$info", "delete");

            return $qwebs.load().then(() => {
                let $router = $qwebs.resolve("$router");
                let options = new Options($router);

                let request = new http.IncomingMessage();
                request.url = "/delete";
                request.pathname = "/delete";
                
                let response = new http.ServerResponse(request);
                
                return options.invoke(request, response).then(res => {
                    expect(res.header.Allow).toBe("DELETE");
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});