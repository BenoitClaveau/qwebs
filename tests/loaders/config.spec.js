var ConfigLoader = require("../../lib/loaders/config"),
    path = require("path"),
    Q = require('q');

describe("configLoader", function () {

    it("create from object", function (done) {
        
        var $qwebs = {
            root: __dirname
        };
        
        return Q.try(function() {
            
            var cfg = {
                folder: "public1"
            };
            var config = new ConfigLoader($qwebs).create(cfg);
            
            expect(config.folder).toEqual("public1");
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("create from file", function (done) {
       
        var $qwebs = {
            root: __dirname
        };
        
        return Q.try(function() {
            var config = new ConfigLoader($qwebs).create("./config.json");
            
            expect(config.folder).toEqual("public2");
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});