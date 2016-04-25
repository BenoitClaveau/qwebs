var Router = require('../lib/router'),
    Injector = require("../lib/injector"),
    Q = require('q');

describe("route", function () {
    
    var init = function() {
        return Q.try(function() {
            var injector = new Injector();
            var mockQwebs = {
                root: __dirname,
                loaded: true,
                injector: injector,
                resolve: function(name) {
                    return injector.resolve(name);
                }
            };

            var router = new Router(mockQwebs);
            
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
            
            var item = mock.router.get("/info");
            item.register("$info", "getInfo");
            
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/info";
            return mock.router.invoke(mock.request, mock.response, "/info").then(function(res) {
               expect(res.whoiam).toBe("I'm Info service.");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("route *", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            item = mock.router.get("/*");
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
        }).finally(done);
    });
    
    it("multiple", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            var item = mock.router.get("/info");
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
        }).finally(done);
    });
    
    it("multiple invert declaration", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            var item = mock.router.get("/*");
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
        }).finally(done);
    });
    
    it("multiple redirection", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            var item = mock.router.get("/*");
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
        }).finally(done);
    });
    
    it("multiple token", function (done) {
        return init().then(function(mock) {
            mock.injector.inject("$info", "./services/info.js");
            
            var item = mock.router.get("/*");
            item.register("$info", "getMessage");
            item.load(mock.injector.resolve("$qwebs"));
            
            item = mock.router.get("/*/*");
            item.register("$info", "getInfo");
            item.load(mock.injector.resolve("$qwebs"));
            
            mock.request.url = "/test/3";
            
            mock.router.getTree.trace();
            
            return mock.router.invoke(mock.request, mock.response).then(function(res) {
                expect(res.whoiam).toBe("I'm Info service.");
            });
            
        }).catch(function (error) {
            //expect(error).toBeNull();
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});