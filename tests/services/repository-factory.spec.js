/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Qwebs = require("../../index");

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("Repository", () => {
    
    it("keys", async () => {
        let qwebs = new Qwebs({ dirname: __dirname, config: {} });
        await qwebs.load();
        const repositoryFactory = await qwebs.resolve("$repository-factory");
        let repository = repositoryFactory.create(__dirname);
        var properties = Object.keys(repository);
        expect(properties.length).to.be(0);
    });
});