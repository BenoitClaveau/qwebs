/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Options = require('../../lib/routes/options');
const http = require("http");

describe("options", () => {

    it("*", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: { folder: false }});
            return $qwebs.load().then(() => {
                let $router = $qwebs.resolve("$router");
                let options = new Options($router);
                
                let request = new http.IncomingMessage();
                request.url = "*";
                
                let response = new http.ServerResponse(request);
                
                return options.invoke(request, response).then(res => {
                    expect(res.header.Allow).toBe("GET,POST,PUT,DELETE,HEAD,OPTIONS");
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});