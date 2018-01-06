/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Qwebs = require("../../index");
const fs = require("fs");
const { FromArray } = require("../../index");

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("json-stream", () => {

    it("parse array", async () => {
        let qwebs = new Qwebs({ dirname: __dirname, config: {}});
        await qwebs.load();
        const $json = await qwebs.resolve("$json-stream");

        fs.createReadStream(`${__dirname}/../data/npm.array.json`)
            .pipe($json.parse()).on("data", chunk => {
                expect(chunk).property("id");
                expect(chunk).property("key");
            });
    }).timeout(5000)

    it("parse object", async () => {
        let qwebs = new Qwebs({ dirname: __dirname, config: {} });
        await qwebs.load();
        const $json = await qwebs.resolve("$json-stream");

        fs.createReadStream(`${__dirname}/../data/npm.object.json`)
            .pipe($json.parse()).on("data", chunk => {
                expect(chunk.offset).to.be(0);
                expect(chunk.rows.length).to.be(4028);
                expect(chunk.total_rows).to.be(4028);
            });
    }).timeout(5000)
});
