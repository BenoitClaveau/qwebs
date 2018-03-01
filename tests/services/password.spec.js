/*!
 * qwebs
 * Copyright(c) 2018 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Crypto = require("../../lib/services/crypto");
const Password = require("../../lib/services/password");

require("process").on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at:", p, "reason:", reason);
});

describe("password", () => {
    it("generate", () => {
        const password = new Password(new Crypto());
        const { password, clear, salt } = password.generate();
        expect(salt.length).to.be(32);
        expect(clear).not.to.be(null);
        expect(password).not.to.be(null);
    });
});
