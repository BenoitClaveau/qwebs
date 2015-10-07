var Router = require('../lib/router'),
    Q = require('q');

describe("injector", function () {

    it("load", function (done) {
        
        return Q.try(function() {
            var mockQwebs = {
                root: __dirname
            };
             
            var router = new Router(mockQwebs);
            
            var item = router.get("/info");
            item.register("$info", "getInfo");
            
            var mockRequest = {
            };
            
            var mockResponse = {
                
            };
            
            router.invoke(mockRequest, mockResponse, "/info").then(function() {
               console.log("ok"); 
            });
            
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
   
});