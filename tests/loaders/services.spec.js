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
        
        let $qwebs = new Qwebs({ dirname: __dirname, config: { services: "services.json" }});
        let $fs = $qwebs.resolve("$fs");
        let $config = $qwebs.resolve("$config");
        
        const loader = new ServicesLoader($qwebs, $fs, $config);
        const file = loader.load();

        expect(file.services.length).to.be(1);            
        expect(file.services[0].name).to.be("$info");
        expect(file.services[0].location).to.be("../services/info.es6");
    });
});
