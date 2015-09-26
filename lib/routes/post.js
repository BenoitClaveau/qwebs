/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

var Get = require("./get"),
    path = require("path"),
    multiparty = require("multiparty"),
    DataError = require("./../dataerror"),
    querystring = require("querystring"),
    Q = require("q");
	
function Post(route) {
    Get.call(this, route);
};

Post.prototype = Object.create(Get.prototype);
Post.prototype.constructor = Post;

Post.prototype.invoke = function (request, response) {
    var self = this;

    return Q.try(function () {
        if (self.view == null) throw new DataError({ message: "No view definied for post: " + self.route });

        request.params = self.pathRegex.params || {};

        var mime = "application/json";
        var contentType = request.headers["content-type"];

        if (contentType) {
            var contentTypes = contentType.split(";");
            mime = contentTypes[0];
        };

        if (mime == "multipart/form-data") {
            //if (!self.qwebs.config.temp) throw new DataError({ message: "Temp is not defined in qwebs config." });
            
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
            return self.controller;
        });

        return self.view.call(self.controller, request, response, promise);
    });

};

Post.prototype.readBody = function (request, response) {
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

exports = module.exports = Post;
