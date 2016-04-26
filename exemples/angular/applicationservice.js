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

ApplicationService.prototype.index = function (request, response) {
    return qwebs.reroute("/template.html", request, response); //reroute to asset
};

ApplicationService.prototype.cities = function (request, response) {
    return response.send({ request: request, content: this.data });
};

ApplicationService.prototype.city = function (request, response) {
    this.data.push(request.body);
    return response.send({ request: request, content: request.body });
};

ApplicationService.prototype.toJpeg = function (request, response) {
    var match = /data:(\S*);(\S*),(.+)/.exec(request.body.datauri);
    
    if (!match) throw new Error("Bad format.");
    
    var contentType = match[1];
    var data64 = match[3];
    
    var buffer = new Buffer(data64, "base64");
    return this.$qjimp.toImage(buffer).then(function (image) {
        return this.$qjimp.toBuffer(image, "image/jpeg").then(function (newBuffer) {
            var header = { 
                "Content-Type": "image/jpeg",
                "Expires": new Date(Date.now() + 604800000).toString(), /* 1000 * 60 * 60 * 24 * 7 (7 days)*/
                "Etag": '"0.0.1"'
            };
            return response.send({ header: header, request: request, content: newBuffer })
        });
    });
};

exports = module.exports = ApplicationService;