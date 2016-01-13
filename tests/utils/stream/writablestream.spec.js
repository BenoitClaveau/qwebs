var WritableStream = require("../../../lib/utils/stream/writablestream"),
    fs = require("fs"),
    stream = require("stream"),
    path = require("path"),
    Q = require('q');

describe("Stream", function () {

    it("merge", function (done) {
        
        return Q.try(function() { 
            
            var output = new WritableStream();
            
            ["data/page1.html", "data/page2.html"].forEach(function(file) {
                var filepath = path.join(__dirname, file);
                output = fs.createReadStream(filepath).pipe(output);
            });
            
            return output;
        })
        .then(function(buffer) {
            expect(buffer.length).toEqual(152);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});