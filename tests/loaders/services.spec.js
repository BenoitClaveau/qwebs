/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const ServicesLoader = require("../../lib/loaders/Services");
const expect = require('expect.js');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("ServicesLoader", () => {
    
    it("load", async () => {
        
        let $qwebs = new Qwebs({ dirname: __dirname, config: { services: "services.json" }});
        let $fileLoader = $qwebs.resolve("$fileLoader");
        let $config = $qwebs.resolve("$config");
        
        const loader = new ServicesLoader($qwebs, $fileLoader, $config);
        const file = await loader.load();

        expect(file.services.length).to.be(1);            
        expect(file.services[0].name).to.be("$info");
        expect(file.services[0].location).to.be("../services/info.es6");
    });
});
