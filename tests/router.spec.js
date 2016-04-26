/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Router = require('../lib/router');
const Injector = require("../lib/injector");

describe("router", function () {
    
    let init = function() {
        return Promise.resolve().then(() => {
            let injector = new Injector();
            let mockQwebs = {
                root: __dirname,
                loaded: true,
                injector: injector,
                resolve: function(name) {
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

    it("single route", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "getInfo");
            
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            return mock.router.invoke(mock.request, mock.response, "/info").then(function(res) {
               expect(res.whoiam).toBe("I'm Info service.");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("route *", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/info").then(function(res) {
                expect(res.whoiam).toBe("I'm Info service.");
                
                return mock.router.invoke(mock.request, mock.response, "/test").then(function(res) {
                    expect(res.whoiam).toBe("I'm Info service.");
                });
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("multiple", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/*");
            item.register("$info", "getMessage");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/info").then(function(res) {
                expect(res.whoiam).toBe("I'm Info service.");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("multiple invert declaration", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "getMessage");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/info");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/info").then(function(res) {
                expect(res.whoiam).toBe("I'm Info service.");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("multiple redirection", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "getMessage");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/info");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            
            return mock.router.invoke(mock.request, mock.response, "/test").then(function(res) {
                expect(res.text).toBe("hello world");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("multiple token", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/*");
            item.register("$info", "getMessage");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/*/*");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/test/3";
            
            return mock.router.invoke(mock.request, mock.response).then(function(res) {
                expect(res.whoiam).toBe("I'm Info service.");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("multiple end route", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            let item = mock.router.get("/info");
            item.register("$info", "getMessage");

            item = mock.router.get("/info");
            item.register("$info", "getInfo");
            
            fail();
        }).catch(function (error) {
            expect(error.message).toEqual("Multiple end route.");
        }).then(done);
    });
});