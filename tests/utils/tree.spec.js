var Tree = require('../../lib/utils/tree'),
    Q = require('q');

describe("tree", function () {

    it("root", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: "/" });
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
            
            var item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
    
    it("multiple parameters", function (done) {
        
        return Q.try(function() {
            var tree = new Tree();
            
            tree.push({ id: 1, route: ":route/info/:value" });
            tree.push({ id: 2, route: "api/info/:value" });

            var item = tree.findOne("data/info/1");
            expect(item.router.id).toEqual(1);
            expect(item.params.route).toEqual("data");
            expect(item.params.value).toEqual("1");
            
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).finally(done);
    });
});
