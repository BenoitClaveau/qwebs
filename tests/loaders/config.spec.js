/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
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
        }).catch(fail).then(done);
    });
    
    it("create from file", done => {
        return Promise.resolve().then(() => {
             let $qwebs = {
                root: __dirname
            };
            let config = new ConfigLoader($qwebs).create("config.json");
            expect(config.folder).toEqual("public2");
        }).catch(fail).then(done);
    });
});