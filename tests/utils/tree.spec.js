var Tree = require('../../lib/utils/tree'),
    Q = require('q');

describe("tree", function () {

    it("create", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: ":test/info" });
            tree.push({ id: 2, route: "api/:value/info" });
            tree.push({ id: 4, route: "api/:test" });
            tree.push({ id: 5, route: "api/value" });
            tree.push({ id: 6, route: "api/api" });
            tree.push({ id: 7, route: "api/value1" });
            
            tree.nodes.trace();
            expect(tree.findOne("api/alert").id).toEqual(4);
            expect(tree.findOne("/api/alert").id).toEqual(4);
            
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("root", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: "/" });
            expect(tree.findOne("").id).toEqual(1);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("root /", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: "/" });
            expect(tree.findOne("/").id).toEqual(1);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("parameters priority", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: ":test/:value" });
            tree.push({ id: 2, route: "api/:value/info" });
            tree.push({ id: 4, route: "api/:test" });
            tree.push({ id: 5, route: "api/value" });
            tree.push({ id: 6, route: "api/api" });
            tree.push({ id: 7, route: "api/value1" });
            
            tree.nodes.trace();
            expect(tree.findOne("api/alert").id).toEqual(4);
            
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
