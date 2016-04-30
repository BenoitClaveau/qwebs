/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Delete = require('../../lib/routes/delete');

describe("delete", () => {

    it("create", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            $qwebs.inject("$info", "../services/info");            

            return $qwebs.load().then(() => {
                let del = new Delete($qwebs, "/delete");
                del.register("$info", "delete");
                del.load();
                
                let request = {
                    url: "/delete",
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