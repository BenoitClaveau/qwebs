var PathRegex = require('../../lib/utils/pathRegex'),
    Q = require('q');

describe("pathRegex", function () {

    it("match static", function (done) {
        
        return Q.try(function() {
            var pathRegex = new PathRegex("/api", false, false);
            expect(pathRegex.match("/api")).toEqual(true);
            expect(pathRegex.match("/api/2")).toEqual(false);
            expect(pathRegex.match("/api/value")).toEqual(false);
            expect(pathRegex.match("/api/")).toEqual(true);
            expect(pathRegex.match("/api-1")).toEqual(false);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("match dynamic", function (done) {
        
        return Q.try(function() {
            var pathRegex = new PathRegex("/api/:id", false, false);
            expect(pathRegex.match("/api/1")).toEqual(true);
            expect(pathRegex.match("/api/2")).toEqual(true);
            expect(pathRegex.match("/api/value")).toEqual(true);
            expect(pathRegex.match("/api/")).toEqual(false);
            expect(pathRegex.match("/api/1/2")).toEqual(false);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});