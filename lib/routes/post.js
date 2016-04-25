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
const Q = require("q");
	
class Post extends Get {
    constructor($qwebs, route) {
        super($qwebs, route);
    };
    
    invoke(request, response) {
        var self = this;

        return Q.try(function () {
            if (self.method == null) throw new DataError({ message: "Method is not defined.", data: { service: self.serviceName, method: self.method }});

            var mime = "application/json";
            var contentType = request.headers["content-type"];

            if (contentType) {
                var contentTypes = contentType.split(";");
                mime = contentTypes[0];
            };

            if (mime == "multipart/form-data") {
                //if (!self.$config.upload || !self.$config.upload.folder) throw new DataError({ message: "Upload folder is not defined in qwebs config." });
                
                var uploadDir = path.resolve(__dirname, "temp"); /*temp file*/
                var form = new multiparty.Form({ uploadDir: uploadDir });
                return Q.ninvoke(form, "parse").then(function (data) {
                    if (data === "") request.body = {};
                    else request.body = data;
                });
            }
            else if (mime == "application/json") {
                return self.readBody(request, response).then(function (data) {
                    if (data === "") request.body = {};
                    else request.body = JSON.parse(data);
                });
            }
            else if (mime == "application/x-www-form-urlencoded") {
                return self.readBody(request, response).then(function (data) {
                    if (data === "") request.body = {};
                    else request.body = querystring.parse(data);
                    //console.log("Qwebs.post(" + request.url + ") body: " + JSON.stringify(request.body));
                });
            }
            else throw new Error(mime + " is not supported.");

        }).then(function () {
            var promise = Q.try(function () {
                return self.service;
            });

            return self.method.call(self.service, request, response, promise);
        });

    };
    readBody(request, response) {
        var data = "";

        var deferred = Q.defer();
        request.on("data", function (chunk) {
            data += chunk;
        });

        request.on("end", function () {
            deferred.resolve(data);
        });

        return deferred.promise;
    };
};

exports = module.exports = Post;
