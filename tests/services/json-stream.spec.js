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

    // it("parse array", async () => {
    //     let qwebs = new Qwebs({ dirname: __dirname });
    //     await qwebs.load();
    //     const $json = await qwebs.resolve("$json-stream");
    //     const parser = $json.parse();

    //     fs.createReadStream(`${__dirname}/../data/npm.array.json`)
    //         .pipe(parser).on("data", chunk => {
    //             console.log(chunk)
    //         }).on("end", () => {
    //             console.log("----- END ----")
    //         });
    // }).timeout(5000)

    it("parse object", async () => {
        let qwebs = new Qwebs({ dirname: __dirname });
        await qwebs.load();
        const $json = await qwebs.resolve("$json-stream");
        const parser = $json.parse();

        fs.createReadStream(`${__dirname}/../data/npm.object.json`)
            .pipe(parser).on("data", chunk => {
                console.log(chunk)
            }).on("end", () => {
                console.log("----- END ----")
            });
    }).timeout(5000)
});
