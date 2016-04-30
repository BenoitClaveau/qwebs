/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const Post = require('../../lib/routes/post');

describe("post", () => {

    it("create", done => {
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            $qwebs.inject("$info", "../services/info");            

            return $qwebs.load().then(() => {
                let post = new Post($qwebs, "/save");
                post.register("$info", "save");
                post.load();
                
                let request = {
                    url: "/save",
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