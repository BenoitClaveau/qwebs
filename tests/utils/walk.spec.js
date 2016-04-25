var walk = require('../../lib/utils/walk'),
    Q = require('q');

describe("walk", function () {

    it("get", function (done) {
        
        return Q.try(function() {
            
            var files = walk.get(__dirname);
            expect(files.length).toEqual(6);
            expect(files[0].slice(__dirname.length)).toEqual("/contentType.spec.js");
            expect(files[1].slice(__dirname.length)).toEqual("/pathRegex.spec.js");
            expect(files[2].slice(__dirname.length)).toEqual("/stream/data/page1.html");
            expect(files[3].slice(__dirname.length)).toEqual("/stream/data/page2.html");
            expect(files[4].slice(__dirname.length)).toEqual("/tree.spec.js");
            expect(files[5].slice(__dirname.length)).toEqual("/walk.spec.js");
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
