/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const Qwebs = require("../../lib/qwebs");
const http = require("http");
const request = require('request');

describe("post", () => {

    it("post", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.delete("/delete", "$info", "delete");

            return $qwebs.load().then(() => {
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).then(res => {
                        expect(res.status).toBe("deleted");
                    }).catch(error => {
                        expect(error).toBeNull();
                    }).then(() => {
                        done();
                    });
                }).listen(1338);
                
                let $client = $qwebs.resolve("$client");
                return $client.delete({ url: "http://localhost:1338/delete", json: { login: "test" }});
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
});
