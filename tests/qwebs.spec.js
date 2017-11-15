/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Qwebs = require("../lib/qwebs");

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("qwebs", () => {
    
    it("load", async () => {
        const qwebs = new Qwebs({ dirname: __dirname, config: "config.json"});
        await qwebs.load();
        await qwebs.unload();
    }, 5000);
});