/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const stringUtils = require('../../lib/utils/string');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("StringUtils", () => {

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.camelCaseToDash("$testModel");
            expect(res).toEqual("$test-model");
        }).catch(fail).then(done);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.camelCaseToDash("oauth2Model");
            expect(res).toEqual("oauth2-model");
        }).catch(fail).then(done);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.dashToCamelCase("test-model");
            expect(res).toEqual("testModel");
        }).catch(fail).then(done);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.dashToCamelCase("oauth2-model");
            expect(res).toEqual("oauth2Model");
        }).catch(fail).then(done);
    });
});
