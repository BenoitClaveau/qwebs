/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const MyJSON = new require('../../lib/services/json');
const $JSON = new MyJSON();
const MyJSONStream = new require('../../lib/services/json-stream');
const $JSONStream = new MyJSONStream($JSON);
const StreamFromArray = require('../../lib/stream/fromarray');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", async () => {
        const qwebs = new Qwebs();
        const $fs = qwebs.resolve("$fs");
        const $JSON = qwebs.resolve("$JSON");
        const $JSONStream = qwebs.resolve("$JSONStream");
    
        const data = $fs.load("./data.npm.array.json");
        
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

    // it("parse empty", async (done) => {
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
