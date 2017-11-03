/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Qwebs = require("../../index");
const { FromArray } = require("../../index");

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", async () => {
        let qwebs = new Qwebs({ dirname: __dirname });
        const $fs = await qwebs.resolve("$fs");
        const $JSON = await qwebs.resolve("$JSON");
        const $JSONStream = await qwebs.resolve("$JSONStream");
        const data = await $fs.load("./data/npm.array.json");
        
        let stream = new FromArray(data);
        const output = stream.pipe($JSONStream.stringify)
            .on("data", (data) => {
                if (["[", "]", ","].some(e => e == data)) return;
                const item = JSON.parse(data);
                console.log(item.value.rev);
            }).on("finish", () => {
                console.log("finish");
            }).on("end", (end) => {
                console.log("end");
            })
    }).timeout(5000)
});
