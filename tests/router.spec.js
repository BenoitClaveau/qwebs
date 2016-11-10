/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const http = require("http");
const Qwebs = require("../lib/qwebs");
const Router = require('../lib/router');
const Injector = require("../lib/injector");

describe("router", () => {
    
    let init = () => {
        return Promise.resolve().then(() => {
            let injector = new Injector();
            let mockQwebs = {
                root: __dirname,
                loaded: true,
                injector: injector,
                resolve: name => {
                    return injector.resolve(name);
                }
            };

            let router = new Router(mockQwebs);
            
            injector.inject("$qwebs", mockQwebs);
            injector.inject("$injector", injector);
            
            return {
                router: router,
                injector: injector,
                request: {
                    url: "/",
                    method: "GET"
                },
                response: {
                }
            };
        });
    };

    it("single route", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./services/info");
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
                let request = $client.get({ url: "http://localhost:1337/get" }).then(data => {
                    console.log(data);
                    expect(data.whoiam).toBe("I'm Info service.");
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
    
    it("route *", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./services/info");
            $qwebs.get("/*", "$info", "getInfo");

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
                let request = $client.get({ url: "http://localhost:1337/info" }).then(data => {
                    console.log(data);
                    expect(data.whoiam).toBe("I'm Info service.");
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

    it("multiple", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./services/info");
            $qwebs.get("/info", "$info", "getInfo");
            $qwebs.get("/*", "$info", "getMessage");

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
                let request = $client.get({ url: "http://localhost:1337/info" }).then(data => {
                    console.log(data);
                    expect(data.whoiam).toBe("I'm Info service.");
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
    
    it("multiple invert declaration", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "./services/info");
            $qwebs.get("/*", "$info", "getMessage");
            $qwebs.get("/info", "$info", "getInfo");

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
                let request = $client.get({ url: "http://localhost:1337/info" }).then(data => {
                    console.log(data);
                    expect(data.whoiam).toBe("I'm Info service.");
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
            
    it("multiple redirection", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/info");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/test").then(res => {
                expect(res).toBe("I'm Info service.");
            });
            
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("multiple token", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "getMessage");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/*/*");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/test/3";
            
            return mock.router.invoke(mock.request, mock.response).then(res => {
                expect(res).toBe("I'm Info service.");
            });
            
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("multiple end route", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "getMessage");

            item = mock.router.get("/info");
            item.register("$info", "getInfo");
            
            fail();
        }).catch(error => {
            expect(error.message).toEqual("Multiple end route.");
        }).then(() => {
            done();
        });
    });
});
