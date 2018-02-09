/*!
 * qwebs
 * Copyright(c) 2018 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Crypto = require("../../lib/services/crypto");

require("process").on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at:", p, "reason:", reason);
});

describe("walk", () => {
    it("encrypted", () => {
        const crypto = new Crypto();
        const iv = crypto.iv;
        const hash = crypto.hash("p@ssw0rd");
        expect(hash.length).to.be(32);
        const encrypted = crypto.encrypt("mon text", hash, iv);
        expect(encrypted.toString()).not.to.be("mon text");
        const decrypted = crypto.decrypt(encrypted, hash, iv);
        expect(decrypted.toString()).to.be("mon text");
    });

    it("encryptBase64", () => {
        const crypto = new Crypto();
        const iv = crypto.iv;
        const hash = crypto.hash("p@ssw0rd");
        expect(hash.length).to.be(32);
        const encrypted = crypto.encryptBase64("mon text", hash, iv);
        expect(encrypted).not.to.be("mon text");
        const decrypted = crypto.decryptBase64(encrypted, hash, iv);
        expect(decrypted).to.be("mon text");
    });
});
