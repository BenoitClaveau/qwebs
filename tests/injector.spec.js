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
   
});