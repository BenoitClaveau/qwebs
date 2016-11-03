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

    it("create", done => {
        let server = null;
        return Promise.resolve().then(() => {
            let $qwebs = new Qwebs({ dirname: __dirname, config: {}});
            
            $qwebs.inject("$info", "../services/info");
            $qwebs.delete("/save", "$info", "delete");

            return $qwebs.load().then(() => {
                server = http.createServer((request, response) => {
                    return $qwebs.invoke(request, response).then(res => {
                        expect(res.status).toBe("saved");
                    }).catch(error => {
                        expect(error).toBeNull();
                    }).then(() => {
                        done();
                    });
                }).listen(1337);
                
                let $client = $qwebs.resolve("$client");
                $client.delete("http://localhost:1337/delete", { login: "test" });
            });
        }).catch(error => {
            expect(error.message).toBeNull();
        }).then(() => {
            if (server) server.close();
            done();
        });
    });
});
