const Qwebs = require("../../lib/qwebs");
const RoutesLoader = require("../../lib/loaders/routes");
const Q = require('q');

describe("routesLoader", function () {
    
    it("load", function (done) {
        
        return Q.try(function() {
            var cfg = {
                routes: "./routes.json"
            };
            
            var $qwebs = new Qwebs({ dirname: __dirname, config: cfg });
            
            return new RoutesLoader($qwebs, $qwebs.resolve("$config")).load().then(function(routes) {
                expect(routes.services.length).toEqual(1);            
                expect(routes.services[0].name).toEqual("$info");
                expect(routes.services[0].location).toEqual("../services/info");
                expect(routes.locators[0].get).toEqual("/info");
                expect(routes.locators[0].service).toEqual("$info");
                expect(routes.locators[0].method).toEqual("getInfo");
            });

        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
