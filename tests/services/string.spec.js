/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const StringService = require('../../lib/services/string');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("StringUtils", () => {

    it("camelCaseToDash", () => {
        let res = StringService.camelCaseToDash("$testModel");
        expect(res).to.be("$test-model");
    });

    it("camelCaseToDash", () => {
        let res = StringService.camelCaseToDash("oauth2Model");
        expect(res).to.be("oauth2-model");
    });

    it("camelCaseToDash", () => {
        let res = StringService.dashToCamelCase("test-model");
        expect(res).to.be("testModel");
    });

    it("camelCaseToDash", () => {
        let res = StringService.dashToCamelCase("oauth2-model");
        expect(res).to.be("oauth2Model");
    });

    it("capitalizeFirstLetter", () => {
        let res = StringService.capitalizeFirstLetter("oauth2 model");
        expect(res).to.be("Oauth2 model");
    });

    it("capitalizeFirstLetter", () => {
        let res = StringService.capitalizeFirstLetter("");
        expect(res).to.be("");
    });
});
