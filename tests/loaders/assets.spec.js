var Qwebs = require("../../lib/qwebs"),
    assetsLoader = require("../../lib/loaders/assets"),
    Q = require('q');

describe("assetsLoader", function () {

    it("load", function (done) {
        
        return Q.try(function() {
            
            var cfg = {
                folder: "public"
            };
            
            var $qwebs = new Qwebs({ dirname: __dirname, config: cfg });
        
            return assetsLoader.load($qwebs).then(function(assets) {
                expect(assets.length).toEqual(2);            
                expect(assets[0].route).toEqual("/assets/user.svg");
                expect(assets[1].route).toEqual("/main.html");
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
