var contentType = require('../../lib/utils/contentType'),
    Q = require('q');

describe("contentType", function () {

    it("getFromExt", function (done) {
        
        return Q.try(function() {            
            expect(contentType.getFromExt(".js")).toEqual("application/javascript");
            expect(contentType.getFromExt(".json")).toEqual("application/json");
            expect(contentType.getFromExt(".png")).toEqual("image/png");
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("getFromExt exception", function (done) {
        
        return Q.try(function() {            
            expect(contentType.getFromExt(".mp3")).toEqual("audio/mpeg");
            fail();
        })
        .catch(function (error) {
            expect(error.stack).not.toBeNull();
        }).finally(done);
    });
});