/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Qwebs = require("../../lib/qwebs");

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", async () => {
        const qwebs = new Qwebs();
        const $fs = await qwebs.resolve("$fs");
        const $JSON = await qwebs.resolve("$JSON");
        const $JSONStream = await qwebs.resolve("$JSONStream");
        const data = await $fs.load("./data/npm.array.json");
        
        let stream = new StreamFromArray();
        const output = stream.pipe($JSONStream.stringify);
        output.on("data", (data) => {
            if (["[", "]", ","].some(e => e == data)) return;
            const item = JSON.parse(data);
            console.log(item.value.rev);
        })
        output.on("end", (end) => {
            console.log("* end *")
        })
        output.on("finish", () => {
            console.log("* finish *")
        })
        stream.array = data;
    })

    // it("parse empty", async () => {
    //     const expected = JSON.parse(fs.readFileSync(file));
    //     let parser = parse();

    //     let parsed = [];
    //     parser.on('data', data => {
    //         console.log(data);
    //         parsed.push(data)
    //     });
        
    //     //fs.createReadStream(file).pipe(parser);
    //     let stream = fs.createReadStream(file)

    //     return new Promise((resolve, reject) => {
    //         parser.on('end', () => {
    //             resolve();
    //         })
    //         parser.on('error', error => {
    //             reject(error);
    //         })
    //     }).catch(fail).then(done)
    // })

});
