/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const walk = require('../../lib/utils/walk');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("walk", () => {
    it("get", () => {
        let files = walk.get(__dirname);
        expect(files.length).to.be(3);
        expect(files[0].slice(__dirname.length)).to.be("/repository.spec.js");
        expect(files[1].slice(__dirname.length)).to.be("/string.spec.js");
        expect(files[2].slice(__dirname.length)).to.be("/walk.spec.js");
    });
});
