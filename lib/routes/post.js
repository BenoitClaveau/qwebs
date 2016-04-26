/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const Get = require("./get");
const path = require("path");
const multiparty = require("multiparty");
const DataError = require("./../dataerror");
const querystring = require("querystring");
	
class Post extends Get {
    constructor($qwebs, route) {
        super($qwebs, route);
    };
    
    invoke(request, response) {
        
        return Promise.resolve().then(() => {
            if (this.method == null) throw new DataError({ message: "Method is not defined.", data: { service: this.serviceName, method: this.method }});

            var mime = "application/json";
            var contentType = request.headers["content-type"];

            if (contentType) {
                var contentTypes = contentType.split(";");
                mime = contentTypes[0];
            };

            if (mime == "multipart/form-data") {
                
                var uploadDir = path.resolve(__dirname, "temp"); /*temp file*/
                var form = new multiparty.Form({ uploadDir: uploadDir });
                let data = form.parse();
                if (data === "") request.body = {};
                else request.body = data;
            }
            else if (mime == "application/json") {
                return this.readBody(request, response).then(data => {
                    if (data === "") request.body = {};
                    else request.body = JSON.parse(data);
                });
            }
            else if (mime == "application/x-www-form-urlencoded") {
                return this.readBody(request, response).then(data => {
                    if (data === "") request.body = {};
                    else request.body = querystring.parse(data);
                });
            }
            else throw new Error(mime + " is not supported.");

        }).then(() => {
            return super.invoke(request, response);
        });

    };
    readBody(request, response) {
        return new Promise((resolve, reject) => {
            var data = "";

            request.on("data", chunk => {
                data += chunk;
            });

            request.on("end", () => {
                resolve(data);
            });
            
            request.on("error", error => {
                reject(error);
            });
        });
    };
};

exports = module.exports = Post;
