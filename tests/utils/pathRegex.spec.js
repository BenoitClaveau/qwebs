/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const PathRegex = require('../../lib/utils/pathRegex');

describe("pathRegex", function () {

    it("match static", function (done) {
        
        return Promise.resolve().then(() => {
            var pathRegex = new PathRegex("/api", false, false);
            expect(pathRegex.match("/api").match).toEqual(true);
            expect(pathRegex.match("/api/2").match).toEqual(false);
            expect(pathRegex.match("/api/value").match).toEqual(false);
            expect(pathRegex.match("/api/").match).toEqual(true);
            expect(pathRegex.match("/api-1").match).toEqual(false);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("match dynamic", function (done) {
        
        return Promise.resolve().then(() => {
            var pathRegex = new PathRegex("/api/:id", false, false);
            expect(pathRegex.match("/api/1").match).toEqual(true);
            expect(pathRegex.match("/api/2").match).toEqual(true);
            expect(pathRegex.match("/api/value").match).toEqual(true);
            expect(pathRegex.match("/api/").match).toEqual(false);
            expect(pathRegex.match("/api/1/2").match).toEqual(false);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("match generic", function (done) {
        
        return Promise.resolve().then(() => {
            var pathRegex = new PathRegex("/api/*", false, false);
            expect(pathRegex.match("/api/1").match).toEqual(true);
            expect(pathRegex.match("/api/2").match).toEqual(true);
            expect(pathRegex.match("/api/value").match).toEqual(true);
            expect(pathRegex.match("/api/").match).toEqual(true);
            expect(pathRegex.match("/api/1/2").match).toEqual(true);
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("params", function (done) {
        
        return Promise.resolve().then(() => {
            var pathRegex = new PathRegex("/api/:id", false, false);
            expect(pathRegex.match("/api/1").params.id).toEqual("1");
        })
        .catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
});