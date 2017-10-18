/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const fs = require ('fs');
const { join } = require('path');
const file = join(__dirname, 'data','npm.array.json')
const MYJSON = new require('../../lib/services/json');
const $JSON = new MYJSON();
const MYJSONStream = new require('../../lib/services/json-stream');
const $JSONStream = new MYJSONStream($JSON);
const StreamFromArray = require('../../lib/stream/fromarray');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", done => {
        const data = JSON.parse(fs.readFileSync(file));
        
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

    // it("parse empty", done => {
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
