var Tree = require('../../lib/utils/tree'),
    Q = require('q');

describe("tree", function () {

    it("root", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: "/" });
            console.log(tree.findOne(""))
            expect(tree.findOne("").router.id).toEqual(1);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("root /", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: "/" });
            expect(tree.findOne("/").router.id).toEqual(1);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("parameters priority", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: ":test/:value" });
            tree.push({ id: 2, route: "api/:test/info" });
            tree.push({ id: 3, route: "api/:test" });

            tree.nodes.trace();
            var item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("parameters priority", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 2, route: "api/:test/info" });
            tree.push({ id: 1, route: ":test/:value" });
            tree.push({ id: 3, route: "api/:test" });

            tree.nodes.trace();
            var item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("parameters priority", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 3, route: "api/:test" });
            tree.push({ id: 2, route: "api/:test/info" });
            tree.push({ id: 1, route: ":test/:value" });
            
            tree.nodes.trace();
            var item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
