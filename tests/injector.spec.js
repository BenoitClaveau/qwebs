var Injector = require('../lib/injector'),
    Q = require('q');

describe("injector", function () {

    it("inject & resolve", function (done) {
        
        return Q.try(function() {
            var mockQwebs = {
                root: __dirname
            };
             
            var injector = new Injector();
            injector.inject("$qwebs", mockQwebs);
            injector.inject("$info", "./services/info");
            
            var $info = injector.resolve("$info");
            expect($info).not.toBeNull();
            expect($info.whoiam()).toBe("I'm Info service.");
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("inject & load", function (done) {
        
        return Q.try(function() {
            var mockQwebs = {
                root: __dirname
            };
            
            var injector = new Injector();
            injector.inject("$qwebs", mockQwebs);
            injector.inject("$info", "./services/info");
            
            injector.load();
            
            var $info = injector.resolve("$info");
            expect($info).not.toBeNull();
            expect($info.whoiam()).toBe("I'm Info service.");
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
   
});