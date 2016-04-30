/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const PathRegex = require('../../lib/utils/pathRegex');

describe("pathRegex", () => {

    it("match static", done => {
        
        return Promise.resolve().then(() => {
            let pathRegex = new PathRegex("/api", false, false);
            expect(pathRegex.match("/api").match).toEqual(true);
            expect(pathRegex.match("/api/2").match).toEqual(false);
            expect(pathRegex.match("/api/value").match).toEqual(false);
            expect(pathRegex.match("/api/").match).toEqual(true);
            expect(pathRegex.match("/api-1").match).toEqual(false);
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("match dynamic", done => {
        
        return Promise.resolve().then(() => {
            let pathRegex = new PathRegex("/api/:id", false, false);
            expect(pathRegex.match("/api/1").match).toEqual(true);
            expect(pathRegex.match("/api/2").match).toEqual(true);
            expect(pathRegex.match("/api/value").match).toEqual(true);
            expect(pathRegex.match("/api/").match).toEqual(false);
            expect(pathRegex.match("/api/1/2").match).toEqual(false);
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("match generic", done => {
        
        return Promise.resolve().then(() => {
            let pathRegex = new PathRegex("/api/*", false, false);
            expect(pathRegex.match("/api/1").match).toEqual(true);
            expect(pathRegex.match("/api/2").match).toEqual(true);
            expect(pathRegex.match("/api/value").match).toEqual(true);
            expect(pathRegex.match("/api/").match).toEqual(true);
            expect(pathRegex.match("/api/1/2").match).toEqual(true);
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("params", done => {
        
        return Promise.resolve().then(() => {
            let pathRegex = new PathRegex("/api/:id", false, false);
            expect(pathRegex.match("/api/1").params.id).toEqual("1");
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});