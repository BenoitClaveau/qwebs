/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const DataError = require('../lib/dataerror');
const Q = require('q');

describe("injector", function () {

    it("message", function (done) {
        return Q.try(function() {
            throw new DataError({ message: "Mon erreur."});
        }).catch(function (error) {
            expect(error.message).toEqual("Mon erreur.");
            expect(error.header["Content-Type"]).toEqual("application/json");
            expect(error.statusCode).toEqual(500);
        }).finally(done);
    });
    
    it("statusCode 503", function (done) {
        return Q.try(function() {
            throw new DataError({ statusCode: 503 });
        }).catch(function (error) {
            expect(error.statusCode).toEqual(503);
        }).finally(done);
    });
    
    it("ContentType image/png", function (done) {
        return Q.try(function() {
            let header = {
                "Content-Type": "image/png"
            };
            throw new DataError({ header: header });
        }).catch(function (error) {
            expect(error.statusCode).toEqual(500);
        }).finally(done);
    });
    
    it("data", function (done) {
        return Q.try(function() {
            throw new DataError({ data: { value: "33" }});
        }).catch(function (error) {
            expect(error.data[0].value).toEqual("33");
        }).finally(done);
    });
    
    it("data array", function (done) {
        return Q.try(function() {
            throw new DataError({ data: [1,2] });
        }).catch(function (error) {
            expect(error.data.length).toEqual(2);
        }).finally(done);
    });
    
    it("with stack", function (done) {
        return Q.try(function() {
            throw new Error();
        }).catch(function (error) {
            throw new DataError({ stack: error.stack });
        }).catch(function (error) {
            expect(error.stack).not.toBeUndefined();
        }).finally(done);
    });
});