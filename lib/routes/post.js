/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const Get = require("./get");
const path = require("path");
const multiparty = require("multiparty");
const DataError = require("../dataerror");
const querystring = require("querystring");
const fs = require("fs");
const ToString = require("../utils/stream/tostring");

class Post extends Get {
    constructor($qwebs, route) {
        super($qwebs, route);
        this.options.parseBody = true;          //default behaviour
        this.$json = $qwebs.resolve("$json");
    };
    
    parseBody(request, response) {
        return Promise.resolve().then(() => {
            if (!this.method) throw new DataError({ message: "Method is not defined.", data: { service: this.serviceName }});
            if (!request) throw new DataError({ message: "Request is not defined.", data: { service: this.serviceName, method: this.method }});
            if (!response) throw new DataError({ message: "response is not defined.", data: { service: this.serviceName, method: this.method }});

            if (!this.options.parseBody) return;

            let mime = "application/json";
            let contentType = request.headers["content-type"];

            if (contentType) {
                let contentTypes = contentType.split(";");
                mime = contentTypes[0];
            };

            if (mime == "multipart/form-data") {
                let uploadDir = path.resolve(__dirname, "uploaded"); /*temp file*/
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); //TODO move to async

                let form = new multiparty.Form({ uploadDir: uploadDir });
                return new Promise((resolve, reject) => {
                    form.parse(request, (err, fields, files) => {
                        if (err) reject(new DataError({ request: request, message: err.message, stack: err.stack }));
                        else {
                            request.body = {};
                            Object.keys(fields).forEach(name => {
                                request.body[name] = fields[name];
                            });
                            
                            Object.keys(files).forEach(name => {
                                request.body[name] = files[name];
                            });
                            resolve();
                        }
                    });
                });
            }
            else if (mime == "application/json") {
                return request.pipe(new ToString()).then(str => {
                    if (str === "") request.body = {};
                    else request.body = this.$json.parse(str);
                });
            }
            else if (mime == "application/x-www-form-urlencoded") {
                return request.pipe(new ToString()).then(str => {
                    if (str === "") request.body = {};
                    else request.body = querystring.parse(str);
                });
            }
            else throw new Error(mime + " is not supported.");
        });
    };

    invoke(request, response) {
        return this.parseBody(request, response).then(() => {
            return super.invoke(request, response);
        });
    };
};

exports = module.exports = Post;