var Qwebs = require("../../lib/qwebs"),
    routesLoader = require("../../lib/loaders/routes"),
    path = require("path"),
    Q = require('q');

describe("bundleLoader", function () {
    
    it("load", function (done) {
        var cfg = {
            routes: "./routes.json"
        };
        return new Qwebs({ dirname: __dirname, config: cfg }).then(function($qwebs) {
            
            var $info = $qwebs.injector.resolve("$info");
            expect($info).not.toBeNull();
            
            var $router = $qwebs.injector.resolve("$router");
            var route = $router.getTree.findOne("/info");
       
            expect(route.router.route).toEqual("/info");
            expect(route.router.serviceName).toEqual("$info");
            expect(route.router.methodName).toEqual("getInfo");

        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
