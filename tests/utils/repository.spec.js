/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Repository = require('../../lib/utils/repository');
const fs = require("fs");
const path = require('path');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("qjimp", () => {
    it("toImage & toBuffer", () => {
        let repository = new Repository(path.resolve(__dirname,"../services/images"));
        var properties = Object.keys(repository);
        expect(properties.length).to.be(9);
    });
});