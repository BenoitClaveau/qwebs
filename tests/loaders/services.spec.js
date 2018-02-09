/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const Qwebs = require("../../lib/qwebs");
const ServicesLoader = require("../../lib/loaders/services");

describe("ServicesLoader", () => {
    
    it("load", async () => {
        let qwebs = new Qwebs({ dirname: __dirname, config: { services: "./services.json" }});
        await qwebs.load();
        let $injector = await qwebs.resolve("$injector");
        expect(Object.entries($injector.container).length).to.be(15);
    });
});
