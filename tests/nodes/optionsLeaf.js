/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const OptionsLeaf = require('../../lib/utils/optionsLeaf');

describe("options", () => {

    it("*", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: "public" }});
            let $router = $qwebs.resolve("$router");
            
            let optionsLeaf = new OptionsLeaf($router);
            return optionsLeaf;
        }).then(leaf => {
            expect(leaf.router).not.toBeNull();  
        }).catch(error => {
            expect(error).toBeNull();
        }).then(() => {
            done();
        });
    });
});
