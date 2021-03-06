/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

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
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "whoiam");
            
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            return mock.router.invoke(mock.request, mock.response, "/info").then(res => {
               expect(res).toBe("I'm Info service.");
            });
        }).catch(fail).then(done);
    });
    
    it("route *", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/info").then(res => {
                expect(res).toBe("I'm Info service.");
                
                return mock.router.invoke(mock.request, mock.response, "/test").then(res => {
                    expect(res).toBe("I'm Info service.");
                });
            });    
        }).catch(fail).then(done);
    });
    
    it("multiple", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/*");
            item.register("$info", "helloworld");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/info").then(res => {
                expect(res).toBe("I'm Info service.");
            });
        }).catch(fail).then(done);
    });
    
    it("multiple invert declaration", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "helloworld");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/info");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/info").then(res => {
                expect(res).toBe("I'm Info service.");
            });
        }).catch(fail).then(done);
    });
    
    it("multiple redirection", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "helloworld");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/info");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/test").then(res => {
                expect(res).toBe("Hello world.");
            });
        }).catch(fail).then(done);
    });
    
    it("multiple token", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "helloworld");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/*/*");
            item.register("$info", "whoiam");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/test/3";
            
            return mock.router.invoke(mock.request, mock.response).then(res => {
                expect(res).toBe("I'm Info service.");
            });
        }).catch(fail).then(done);
    });
    
    it("multiple end route", done => {
        return init().then(mock => {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "helloworld");

            item = mock.router.get("/info");
            item.register("$info", "whoiam");
            
            throw new Error("Qwebs must generate a multiple end route error.");
        }).catch(error => {
            expect(error.message).toEqual("Multiple end route.");
        }).then(done);
    });
});