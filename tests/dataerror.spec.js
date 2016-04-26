/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const DataError = require('../lib/dataerror');

describe("dataerror", function () {

    it("message", function (done) {
        return Promise.resolve().then(() => {
            throw new DataError({ message: "Mon erreur."});
        }).catch(function (error) {
            expect(error.message).toEqual("Mon erreur.");
            expect(error.header["Content-Type"]).toEqual("application/json");
            expect(error.statusCode).toEqual(500);
        }).then(done);
    });
    
    it("statusCode 503", function (done) {
        return Promise.resolve().then(() => {
            throw new DataError({ statusCode: 503 });
        }).catch(function (error) {
            expect(error.statusCode).toEqual(503);
        }).then(done);
    });
    
    it("ContentType image/png", function (done) {
        return Promise.resolve().then(() => {
            let header = {
                "Content-Type": "image/png"
            };
            throw new DataError({ header: header });
        }).catch(function (error) {
            expect(error.statusCode).toEqual(500);
        }).then(done);
    });
    
    it("data", function (done) {
        return Promise.resolve().then(() => {
            throw new DataError({ data: { value: "33" }});
        }).catch(function (error) {
            expect(error.data[0].value).toEqual("33");
        }).then(done);
    });
    
    it("data array", function (done) {
        return Promise.resolve().then(() => {
            throw new DataError({ data: [1,2] });
        }).catch(function (error) {
            expect(error.data.length).toEqual(2);
        }).then(done);
    });
    
    it("with stack", function (done) {
        return Promise.resolve().then(() => {
            throw new Error();
        }).catch(function (error) {
            throw new DataError({ stack: error.stack });
        }).catch(function (error) {
            expect(error.stack).not.toBeUndefined();
        }).then(done);
    });
});