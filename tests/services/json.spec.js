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

    it("parse empty", () => {
        expect(json.parse("{}")).to.be.empty();
    })
            
    it("parse string", () => {
        const obj = json.parse(`{ "name": "benoît"}`);
        expect(obj.name).to.be("benoît");
    });

    it("parse number", () => {
        const obj = json.parse(`{ "version": 1}`);
        expect(obj.version).to.be(1);
    });

    it("parse float", () => {
        const obj = json.parse(`{ "version": 0.487877 }`);
        expect(obj.version).to.be(0.487877);
    });

    it("parse negative number", () => {
        const obj = json.parse(`{ "version": -99 }`);
        expect(obj.version).to.be(-99);
    });

    it("parse date", () => {
        const date = new Date();
        const obj = json.parse(`{ "date": "${date.toJSON()}"}`);
        expect(obj.date).to.eql(date);
    });

    it("parse boolean", () => {
        const date = new Date();
        const obj = json.parse(`{ "activated": true }`);
        expect(obj.activated).to.be(true);
    });
});
