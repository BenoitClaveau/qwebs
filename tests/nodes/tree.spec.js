/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Tree = require('../../lib/nodes/tree');

describe("tree", () => {

    it("root", done => {
        return Promise.resolve().then(() => {
            let tree = new Tree();
            
            tree.push({ id: 1, route: "/" });
            expect(tree.findOne("").router.id).toEqual(1);
            expect(tree.findOne("/").router.id).toEqual(1);
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(done)
    });
    
    it("parameters priority", done => {
        
        return Promise.resolve().then(() => {
            let tree = new Tree();
            
            
            tree.push({ id: 2, route: "api/:test/info" });
            tree.push({ id: 3, route: "api/:test" });
            tree.push({ id: 1, route: ":test/:value" });
            
            let item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("parameters priority", done => {
        
        return Promise.resolve().then(() => {
            let tree = new Tree();
            
            tree.push({ id: 2, route: "api/:test/info" });
            tree.push({ id: 1, route: ":test/:value" });
            tree.push({ id: 3, route: "api/:test" });

            let item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("parameters priority", done => {
        
        return Promise.resolve().then(() => {
            let tree = new Tree();
            
            tree.push({ id: 3, route: "api/:test" });
            tree.push({ id: 2, route: "api/:test/info" });
            tree.push({ id: 1, route: ":test/:value" });
            
            let item = tree.findOne("api/alert");
            expect(item.router.id).toEqual(3);
            expect(item.params.test).toEqual("alert");
            
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("multiple parameters", done => {
        
        return Promise.resolve().then(() => {
            let tree = new Tree();
            
            tree.push({ id: 1, route: ":route/info/:value" });
            tree.push({ id: 2, route: "api/info/:value" });

            let item = tree.findOne("data/info/1");
            expect(item.router.id).toEqual(1);
            expect(item.params.route).toEqual("data");
            expect(item.params.value).toEqual("1");
            
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});
