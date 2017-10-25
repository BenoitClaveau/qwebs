/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const ServicesLoader = require("../../lib/loaders/services");
const expect = require('expect.js');

describe("ServicesLoader", () => {
    
    it("load", async () => {
        
        let $qwebs = new Qwebs({ dirname: __dirname, config: { services: "services.json" }});
        let $file = $qwebs.resolve("$file");
        let $config = $qwebs.resolve("$config");
        
        const loader = new ServicesLoader($qwebs, $file, $config);
        const file = loader.load();

        expect(file.services.length).to.be(1);            
        expect(file.services[0].name).to.be("$info");
        expect(file.services[0].location).to.be("../services/info.es6");
    });
});
