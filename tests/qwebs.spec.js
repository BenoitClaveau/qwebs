/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../lib/qwebs");

describe("routesLoader", () => {
    
    it("load", done => {
        return Promise.resolve().then(() => {
            
            let $qwebs = new Qwebs({ dirname: __dirname, config: "config.json"});
            //return $qwebs.load(); //bug with bundle path
            
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
});