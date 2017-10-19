/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const ConfigLoader = require("../../lib/loaders/config");
const FileLoader = require("../../lib/services/file-loader");
const expect = require('expect.js');

describe("ConfigLoader", () => {

    it("load from object", async () => {
        const $qwebs = { root: __dirname }; //mock qwebs;
        const $fileLoader = new FileLoader($qwebs);
        const config = await new ConfigLoader($fileLoader).load({ folder: "public1" });
        expect(config.folder).to.be("public1");
    });
    
    it("load from file", async () => {
        const $qwebs = { root: __dirname }; //mock qwebs;
        const $fileLoader = new FileLoader($qwebs);
        const config = await  new ConfigLoader($fileLoader).load("config.json");
        expect(config.folder).to.be("public2");
    });
});