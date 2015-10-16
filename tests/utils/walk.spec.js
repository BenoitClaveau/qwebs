var walk = require('../../lib/utils/walk'),
    Q = require('q');

describe("walk", function () {

    it("get", function (done) {
        
        return Q.try(function() {
            
            var files = walk.get(__dirname);
            expect(files.length).toEqual(4);
            expect(files[0].slice(-19)).toEqual("contentType.spec.js");
            expect(files[1].slice(-17)).toEqual("pathRegex.spec.js");
            expect(files[2].slice(-12)).toEqual("tree.spec.js");
            expect(files[3].slice(-12)).toEqual("walk.spec.js");
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
