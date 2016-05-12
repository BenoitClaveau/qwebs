/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Repository = require('../../lib/services/repository');
const fs = require("fs");
const path = require('path');

describe("qjimp", () => {

    it("toImage & toBuffer", done => {
        
        return Promise.resolve().then(() => {
            let repository = Repository.create(path.resolve(__dirname,"./images"));
            var properties = Object.keys(repository);
            expect(properties.length).toBe(9);
            
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});