/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const stringUtils = require('../../lib/utils/string');

describe("StringUtils", () => {

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.camelCaseToDash("$testModel");
            expect(res).toEqual("$test-model");
        }).then(done).catch(fail);
    });

    it("camelCaseToDash", done => {
        return Promise.resolve().then(() => {  
            let res = stringUtils.dashToCamelCase("test-model");
            expect(res).toEqual("testModel");
        }).then(done).catch(fail);
    });
});
