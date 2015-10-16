/*!
 * qwebs service
 */
"use strict";

var qwebs = require("../../lib/qwebs"), 
    Q = require("q");

function ApplicationService($qjimp) {
    this.$qjimp = $qjimp;
    this.data = [
        { name: "Paris" },
        { name: "Lyon" },
        { name: "Marseille" }
    ];
};

ApplicationService.prototype.constructor = ApplicationService;

ApplicationService.prototype.index = function (request, response, promise) {
    return promise.then(function (self) {
        return qwebs.reroute("/template.html", request, response); //reroute to asset
    });
};

ApplicationService.prototype.cities = function (request, response, promise) {
    return promise.then(function (self) {
        return response.send({ request: request, content: self.data });
    });
};

ApplicationService.prototype.city = function (request, response, promise) {
    return promise.then(function (self) {
        self.data.push(request.body);
        return response.send({ request: request, content: request.body });
    });
};

ApplicationService.prototype.toJpeg = function (request, response, promise) {
    return promise.then(function (self) {
        var match = /data:(\S*);(\S*),(.+)/.exec(request.body.datauri);
        
        if (!match) throw new Error("Bad format.");
        
        var contentType = match[1];
        var data64 = match[3];
        
        var buffer = new Buffer(data64, "base64");
        return self.$qjimp.toImage(buffer).then(function (image) {
            return self.$qjimp.toBuffer(image, "image/jpeg").then(function (newBuffer) {
                var header = { 
                    "Content-Type": "image/jpeg",
                    "Expires": new Date(Date.now() + 604800000).toString(), /* 1000 * 60 * 60 * 24 * 7 (7 days)*/
                    "Etag": '"0.0.1"'
                };
                return response.send({ header: header, request: request, content: newBuffer })
            });
        });
    });
};

exports = module.exports = ApplicationService;