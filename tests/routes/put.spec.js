/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Put = require('../../lib/routes/put');

describe("put", () => {

    it("create", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            $qwebs.inject("$info", "../services/info");            

            return $qwebs.load().then(() => {
                let put = new Put($qwebs, "/update");
                put.register("$info", "update");
                put.load();
                
                let request = {
                    url: "/update",
                    headers: {
                    }
                };
                let response = {
                };

                //return post.invoke(request, response);
            });
        }).catch(error => {
            expect(error.message).toBeNull();
        }).then(() => {
            done();
        });
    });
});