/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const FileSystem = new require('../../lib/services/fs');
const fs = new FileSystem({ root: __dirname });

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("FileSystem", () => {

    it("readFile", async () => {
        const file = await fs.readFile("./data/npm.array.json");
        expect(file.length).to.be(4028);            
    });

    it("statSync", async () => {
        const stat = await fs.load("./data");
        expect(file.length).to.be(4028);            
    });

    it("load", async () => {
        const file = await fs.load("./data/npm.array.json");
        expect(file.length).to.be(4028);            
    });
});
