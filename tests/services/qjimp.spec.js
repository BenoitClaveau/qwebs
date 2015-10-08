var QJimp = require('../../lib/services/qjimp'),
	fs = require("fs"),
    path = require('path'),
    Q = require('q');

describe("qjimp", function () {

    it("toImage & toBuffer", function (done) {
        
        return Q.try(function() {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			var output = path.join(__dirname, "./images/world.out.png");
			
			return Q.try(function() {
                if(fs.existsSync(output)) return Q.ninvoke(fs, "unlink", output);
            }).then(function(){
                return Q.ninvoke(fs, "readFile", input);
            }).then(function(buffer){
                return $qjimp.toImage(buffer);
            }).then(function(image){
                return $qjimp.toBuffer(image, "image/png");
            }).then(function(buffer){
                return Q.ninvoke(fs, "writeFile", output, buffer).then(function() {
                    expect(fs.existsSync(output)).toBe(true);
                });
			});
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("size", function (done) {
        
        return Q.try(function() {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			var output = path.join(__dirname, "./images/world.out.png");
			
			return Q.try(function() {
                if(fs.existsSync(output)) return Q.ninvoke(fs, "unlink", output);
            }).then(function(){
                return Q.ninvoke(fs, "readFile", input);
            }).then(function(buffer){
                return $qjimp.toImage(buffer);
            }).then(function(image){
                return $qjimp.size(image).then(function(size) {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(function(image){
                return $qjimp.toBuffer(image, "image/png");
            }).then(function(buffer){
                return Q.ninvoke(fs, "writeFile", output, buffer).then(function() {
                    expect(fs.existsSync(output)).toBe(true);
                });
			});
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });

});