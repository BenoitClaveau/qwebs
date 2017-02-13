/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Repository = require('../../lib/utils/repository');
const fs = require("fs");
const path = require('path');

describe("qjimp", () => {

    it("toImage & toBuffer", done => {
        
        return Promise.resolve().then(() => {
            let repository = new Repository(path.resolve(__dirname,"../services/images"));
            var properties = Object.keys(repository);
            expect(properties.length).toBe(9);
            
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});