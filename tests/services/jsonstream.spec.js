/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const fs = require ('fs');
const { join } = require('path');
const file = join(__dirname, 'data','npm.array.json')
const JSONStream = require('../../services/jsonstream');
const StreamFromArray = require('../../stream/fromarray');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", done => {
        const data = JSON.parse(fs.readFileSync(file));
        
        let stream = new StreamFromArray();
        let stringify = new JSONStream();
        const output = stream.pipe(stringify);
        output.on("data", (data) => {
            console.log(data)
        })
        output.on("end", (end) => {
            console.log(end)
        })
        output.on("finish", (end) => {
            console.log(end)
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
