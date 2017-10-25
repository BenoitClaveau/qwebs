/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const JSON = new require('../../lib/services/json');
const json = new JSON();

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", done => {
        expect(json.parse("{}")).to.be({});
        done();
    })
            
    it("parse property", done => {
        const obj = json.parse(`{ "name": "benoît"}`);
        expect(obj.name).to.be("benoît");
        done();
    });

    it("parse number", done => {
        const obj = json.parse(`{ "version": ${1}}`);
        expect(obj.version).to.be(1);
        done();
    });

    it("parse date", done => {
        const date = new Date();
        const obj = json.parse(`{ "date": "${date.toJSON()}"}`);
        expect(obj.date).to.be(date);
    });

    it("parse boolean", done => {
        const date = new Date();
        const obj = json.parse(`{ "activated": true}`);
        expect(obj.activated).to.be(true);
    });
});
