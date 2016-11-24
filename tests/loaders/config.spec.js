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
            let config = new ConfigLoader($qwebs).create("config.json");
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
            let config = new ConfigLoader($qwebs).create("config.error.json2");
            fail();
        }).catch(error => {
            expect(error.stack).toEqual("Failed to read the configuration file.");
        }).then(() => {
            done();
        });
    });
    
    it("failed to read file", done => {
        return Promise.resolve().then(() => {
             let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create("config.error.json");
            fail();
        }).catch(error => {
            expect(error.stack).toEqual("Failed to parse the configuration file.");
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
            fail();
        }).catch(error => {
            expect(error.message).toEqual("Configuration type is not managed.");
        }).then(() => {
            done();
        });
    });
});
