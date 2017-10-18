/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const fs = require ('fs');
const { join } = require('path');
const file = join(__dirname, 'data','npm.array.json')
const { parse } = new require('../../lib/services/jsonstream');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", done => {
        const expected = JSON.parse(fs.readFileSync(file));
        let parser = parse();

        let parsed = [];
        parser.on('data', data => {
            console.log(data);
            parsed.push(data)
        });
        
        fs.createReadStream(file).pipe(parser);
        let stream = fs.createReadStream(file)
        // stream.on("data", data => {
        //     console.log(data.toString());
        // })
        // stream.on("error", error => {
        //     console.error(error);
        // })

        return new Promise((resolve, reject) => {
            parser.on('end', () => {
                resolve();
            })
            parser.on('error', error => {
                reject(error);
            })
        }).catch(fail).then(done)
    })

});
