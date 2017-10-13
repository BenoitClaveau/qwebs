/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const ServicesLoader = require("../../lib/loaders/Services");

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("ServicesLoader", () => {
    
    it("load", done => {
        
        return Promise.resolve().then(() => {

            let $qwebs = new Qwebs({ dirname: __dirname, config: { services: "services.json" }});
            let $config = $qwebs.resolve("$config");
            
            return new RoutesLoader($qwebs, $config).load().then(file => {
                expect(file.services.length).toEqual(1);            
                expect(file.services[0].name).toEqual("$info");
                expect(file.services[0].location).toEqual("../services/info.es6");
            });
        }).catch(fail).then(done);
    });
});
