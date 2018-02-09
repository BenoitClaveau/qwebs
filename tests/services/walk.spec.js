/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Walk = require('../../lib/services/walk');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("walk", () => {
    it("get", () => {
        let files = new Walk().get(__dirname);
        expect(files.length).to.be(13);
        expect(files[0].slice(__dirname.length)).to.be("/fs.spec.js");
    });
});
