/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const ConfigLoader = require("../../lib/loaders/config");

describe("configLoader", () => {

    it("create from object", done => {
        return Promise.resolve().then(() => {
            let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create({ folder: "public1" });
            expect(config.folder).toEqual("public1");
            
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("create from file", done => {
        return Promise.resolve().then(() => {
             let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create("config.json");
            expect(config.folder).toEqual("public2");
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("failed to read file", done => {
        return Promise.resolve().then(() => {
             let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create("config0.json");
            expect(true).toEqual(false);
        }).catch(error => {
            expect(error.message).not.toBeUndefined();
        }).then(() => {
            done();
        });
    });
    
    it("failed to parse file", done => {
        return Promise.resolve().then(() => {
             let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create("config.error.json");
            expect(true).toEqual(false);
        }).catch(error => {
            expect(error.message).not.toBeUndefined();
        }).then(() => {
            done();
        });
    });
    
    it("error", done => {
        return Promise.resolve().then(() => {
            let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create(function() { folder: "public1" });
            expect(true).toEqual(false);
        }).catch(error => {
            expect(error.message).not.toBeUndefined();
        }).then(() => {
            done();
        });
    });
});
