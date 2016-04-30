/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const DataError = require('../lib/dataerror');

describe("dataerror", () => {

    it("message", done => {
        return Promise.resolve().then(() => {
            throw new DataError({ message: "Mon erreur."});
        }).catch(error => {
            expect(error.message).toEqual("Mon erreur.");
            expect(error.header["Content-Type"]).toEqual("application/json");
            expect(error.statusCode).toEqual(500);
        }).then(() => {
            done();
        });
    });
    
    it("statusCode 503", done => {
        return Promise.resolve().then(() => {
            throw new DataError({ statusCode: 503 });
        }).catch(error => {
            expect(error.statusCode).toEqual(503);
        }).then(() => {
            done();
        });
    });
    
    it("ContentType image/png", done => {
        return Promise.resolve().then(() => {
            let header = {
                "Content-Type": "image/png"
            };
            throw new DataError({ header: header });
        }).catch(error => {
            expect(error.statusCode).toEqual(500);
        }).then(() => {
            done();
        });
    });
    
    it("data", done => {
        return Promise.resolve().then(() => {
            throw new DataError({ data: { value: "33" }});
        }).catch(error => {
            expect(error.data[0].value).toEqual("33");
        }).then(() => {
            done();
        });
    });
    
    it("data array", done => {
        return Promise.resolve().then(() => {
            throw new DataError({ data: [1,2] });
        }).catch(error => {
            expect(error.data.length).toEqual(2);
        }).then(() => {
            done();
        });
    });
    
    it("with stack", done => {
        return Promise.resolve().then(() => {
            throw new Error();
        }).catch(error => {
            throw new DataError({ stack: error.stack });
        }).catch(error => {
            expect(error.stack).not.toBeUndefined();
        }).then(() => {
            done();
        });
    });
});