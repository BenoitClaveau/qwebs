/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const RoutesLoader = require("../../lib/loaders/routes");

describe("routesLoader", () => {
    
    it("load", done => {
        
        return Promise.resolve().then(() => {

            let $qwebs = new Qwebs({ dirname: __dirname, config: { routes: "routes.json" }});
            let $config = $qwebs.resolve("$config");
            
            return new RoutesLoader($qwebs, $config).load().then(routes => {
                expect(routes.services.length).toEqual(1);            
                expect(routes.services[0].name).toEqual("$info");
                expect(routes.services[0].location).toEqual("../services/info");
                expect(routes.locators[0].get).toEqual("/info");
                expect(routes.locators[0].service).toEqual("$info");
                expect(routes.locators[0].method).toEqual("getInfo");
            });

        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
});
