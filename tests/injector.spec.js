/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Injector = require('../lib/injector');
const Q = require('q');

describe("injector", function () {

    it("inject & resolve", function (done) {
        
        return Q.try(function() {
            let $qwebs = {
                root: __dirname
            };
             
            let injector = new Injector();
            injector.inject("$qwebs", $qwebs);
            injector.inject("$info", "./services/info");
            
            let $info = injector.resolve("$info");
            expect($info).not.toBeNull();
            expect($info.whoiam()).toBe("I'm Info service.");
        }).catch(function (error) {
            expect(error.message).toBeNull();
        }).finally(done);
    });
    
    it("inject & load", function (done) {
        
        return Q.try(function() {
            let $qwebs = {
                root: __dirname
            };
            
            let injector = new Injector();
            injector.inject("$qwebs", $qwebs);
            injector.inject("$info", "./services/info");
            
            injector.load();
            
            let $info = injector.resolve("$info");
            expect($info).not.toBeNull();
            expect($info.whoiam()).toBe("I'm Info service.");
            
        }).catch(function (error) {
            expect(error.message).toBeNull();
        }).finally(done);
    });
    
    it("try to inject es5", function (done) {
        
        return Q.try(function() {
            let $qwebs = {
                root: __dirname
            };
            
            let injector = new Injector();
            injector.inject("$qwebs", $qwebs);
            injector.inject("$info", "./services/info.es5");
            
            injector.load();
            
            let $info = injector.resolve("$info");
            fail();
        }).catch(function (error) {
            expect(error.message).toEqual("No constructor found.");
        }).finally(done);
    });
    
    it("try to inject cyclic reference", function (done) {
        
        return Q.try(function() {
            let $qwebs = {
                root: __dirname
            };
            
            let injector = new Injector();
            injector.inject("$qwebs", $qwebs);
            injector.inject("$info1", "./services/info1");
            injector.inject("$info2", "./services/info2");
            
            injector.load();
            
            let $info = injector.resolve("$info1");
            fail();
        }).catch(function (error) {
            expect(error.message).toEqual("Cyclic reference.");
        }).finally(done);
    });
});