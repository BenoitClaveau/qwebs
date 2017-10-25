/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const stringUtils = require('../../lib/utils/string');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("StringUtils", () => {

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.camelCaseToDash("$testModel");
            expect(res).to.be("$test-model");
        }).catch(fail).then(done);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.camelCaseToDash("oauth2Model");
            expect(res).to.be("oauth2-model");
        }).catch(fail).then(done);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.dashToCamelCase("test-model");
            expect(res).to.be("testModel");
        }).catch(fail).then(done);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.dashToCamelCase("oauth2-model");
            expect(res).to.be("oauth2Model");
        }).catch(fail).then(done);
    });
});
