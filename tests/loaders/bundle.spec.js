var Qwebs = require("../../lib/qwebs"),
    bundleLoader = require("../../lib/loaders/bundle"),
    path = require("path"),
    Q = require('q');

describe("bundleLoader", function () {
    
    it("load", function (done) {
        var cfg = {
            bundle: "./bundle.json"
        };
        new Qwebs({ dirname: __dirname, config: cfg }).then(function(qwebs) {
            return bundleLoader.load(qwebs).then(function(assets) {
                expect(assets.length).toEqual(1);
                expect(assets[0].route).toEqual("app.css");
                expect(assets[0].contentType).toEqual("text/css");
            });
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
