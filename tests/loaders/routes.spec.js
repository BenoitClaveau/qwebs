var Qwebs = require("../../lib/qwebs"),
    routesLoader = require("../../lib/loaders/routes"),
    path = require("path"),
    Q = require('q');

describe("bundleLoader", function () {
    
    it("load", function (done) {
        var cfg = {
            bundle: "./routes.json"
        };
        new Qwebs({ dirname: __dirname, config: cfg }).then(function(qwebs) {
            
            //todo check self.routes

        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
