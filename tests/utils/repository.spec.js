/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Repository = require('../../lib/utils/repository');
const fs = require("fs");
const path = require('path');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("qjimp", () => {
    it("toImage & toBuffer", done => {
        return Promise.resolve().then(() => {
            let repository = new Repository(path.resolve(__dirname,"../services/images"));
            var properties = Object.keys(repository);
            expect(properties.length).toBe(9);
        }).catch(fail).then(done);
    });
});