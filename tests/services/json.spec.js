/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const JSON = new require('../../lib/services/json');
const json = new JSON();

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("JSON", () => {

    it("parse empty", done => {
        expect(json.parse("{}")).toEqual({});
        done();
    })
            
    it("parse property", done => {
        const obj = json.parse(`{ "name": "benoît"}`);
        expect(obj.name).toEqual("benoît");
        done();
    });

    it("parse number", done => {
        const obj = json.parse(`{ "version": ${1}}`);
        expect(obj.version).toEqual(1);
        done();
    });

    it("parse date", done => {
        const date = new Date();
        const obj = json.parse(`{ "date": "${date.toJSON()}"}`);
        expect(obj.date).toEqual(date);
    });

    it("parse boolean", done => {
        const date = new Date();
        const obj = json.parse(`{ "activated": true}`);
        expect(obj.activated).toEqual(true);
    });
});
