var QStream = require('../../../lib/utils/stream/qstream'),
    fs = require("fs"),
    path = require("path"),
    Q = require('q');

describe("QStream", function () {

    it("merge", function (done) {
        
        return Q.try(function() { 
            
            var qstream = new QStream('');
            
            ["data/page1.html", "data/page2.html"].forEach(function(file) {
                var filepath = path.join(__dirname, file);
                qstream = fs.createReadStream(filepath).pipe(qstream);
            });
            
            return qstream;
        })
        .then(function(content) {
            expect(content.length).toEqual(152);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});