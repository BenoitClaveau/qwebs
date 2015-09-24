var PathRegex = require('../lib/pathRegex'),
    Q = require('q');

describe("A suite for alerts archives mongo collection", function () {

    it("params", function (done) {
        
        return Q.try(function() {
            var pathRegex = new PathRegex("/api/:id", false, false);
            expect(pathRegex.match("/api/1")).toEqual(true);
            expect(pathRegex.match("/api/2")).toEqual(true);
            expect(pathRegex.match("/api/value")).toEqual(true);
            expect(pathRegex.match("/api/")).toEqual(false);
            expect(pathRegex.match("/api/1/2")).toEqual(false);
        })
        .catch(function (error) {
            console.log(error);
            expect(error.stack).toBe("");
        }).finally(done);
    });
});