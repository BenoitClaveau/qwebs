/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const FileSystem = new require('../../lib/services/fs');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("FileSystem", () => {

    it("load", done => {
        const file = await new FileSystem({ root: __dirname }).load("./data/npm.array.json");
        ex
    });
});
