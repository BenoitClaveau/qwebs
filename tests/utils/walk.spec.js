/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const walk = require('../../lib/utils/walk');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("walk", () => {

    it("get", done => {
        
        return Promise.resolve().then(() => {
            
            let files = walk.get(__dirname);
            expect(files.length).to.be(7);
            expect(files[0].slice(__dirname.length)).to.be("/contentType.spec.js");
            expect(files[1].slice(__dirname.length)).to.be("/pathRegex.spec.js");
            expect(files[2].slice(__dirname.length)).to.be("/repository.spec.js");
            expect(files[3].slice(__dirname.length)).to.be("/stream/data/page1.html");
            expect(files[4].slice(__dirname.length)).to.be("/stream/data/page2.html");
            expect(files[5].slice(__dirname.length)).to.be("/string.spec.js");
            expect(files[6].slice(__dirname.length)).to.be("/walk.spec.js");
        }).catch(fail).then(done);
    });
});
