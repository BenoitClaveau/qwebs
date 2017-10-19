/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const WebError = require('../lib/WebError');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("WebError", () => {

    it("message", done => {
        return Promise.resolve().then(() => {
            throw new WebError({ message: "Mon erreur."});
        }).catch(error => {
            expect(error.message).to.be("Mon erreur.");
            expect(error.headers["Content-Type"]).to.be("application/json");
            expect(error.statusCode).to.be(500);
        }).then(done);
    });
    
    it("statusCode 503", done => {
        return Promise.resolve().then(() => {
            throw new WebError({ statusCode: 503 });
        }).catch(error => {
            expect(error.statusCode).to.be(503);
        }).then(done);
    });
    
    it("ContentType image/png", done => {
        return Promise.resolve().then(() => {
            let headers = {
                "Content-Type": "image/png"
            };
            throw new WebError({ headers: headers });
        }).catch(error => {
            expect(error.statusCode).to.be(500);
        }).then(done);
    });
    
    it("data", done => {
        return Promise.resolve().then(() => {
            throw new WebError({ data: { value: "33" }});
        }).catch(error => {
            expect(error.data.value).to.be("33");
        }).then(done);
    });
    
    it("data array", done => {
        return Promise.resolve().then(() => {
            throw new WebError({ data: [1,2] });
        }).catch(error => {
            expect(error.data.array.length).to.be(2);
        }).then(done);
    });
    
    it("with stack", done => {
        return Promise.resolve().then(() => {
            throw new Error();
        }).catch(error => {
            throw new WebError({ stack: error.stack });
        }).catch(error => {
            expect(error.statusCode).to.be(500);
        }).catch(fail).then(done);
    });
});