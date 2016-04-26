/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const ConfigLoader = require("../../lib/loaders/config");

describe("configLoader", function () {

    it("create from object", function (done) {
        return Promise.resolve().then(() => {
            var $qwebs = {
                root: __dirname
            };
            var config = new ConfigLoader($qwebs).create({ folder: "public1" });
            expect(config.folder).toEqual("public1");
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("create from file", function (done) {
        return Promise.resolve().then(() => {
             var $qwebs = {
                root: __dirname
            };
            var config = new ConfigLoader($qwebs).create("config.json");
            expect(config.folder).toEqual("public2");
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
});