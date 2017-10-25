/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const ConfigLoader = require("../../lib/loaders/config");
const file = require("../../lib/services/file");
const expect = require('expect.js');

describe("ConfigLoader", () => {

    it("load from object", async () => {
        const $qwebs = { root: __dirname }; //mock qwebs;
        const $file = new file($qwebs);
        const config = await new ConfigLoader($file).load({ folder: "public1" });
        expect(config.folder).to.be("public1");
    });
    
    it("load from file", async () => {
        const $qwebs = { root: __dirname }; //mock qwebs;
        const $file = new file($qwebs);
        const config = await  new ConfigLoader($file).load("config.json");
        expect(config.folder).to.be("public2");
    });
});