/*!
 * qwebs service
 */
"use strict";

const qwebs = require("../../lib/qwebs");

class ApplicationService {
    constructor($qjimp) {
        this.$qjimp = $qjimp;
        this.data = [
            { name: "Paris" },
            { name: "Lyon" },
            { name: "Marseille" }
        ];
    };

    index(request, response) {
        return qwebs.reroute("/template.html", request, response); //reroute to asset
    };

    cities(request, response) {
        return response.send({ request: request, content: this.data });
    };

    city(request, response) {
        this.data.push(request.body);
        return response.send({ request: request, content: request.body });
    };

    toJpeg(request, response) {
        let match = /data:(\S*);(\S*),(.+)/.exec(request.body.datauri);
        
        if (!match) throw new Error("Bad format.");
        
        let contentType = match[1];
        let data64 = match[3];
        
        let buffer = Buffer.from(data64, "base64");
        return this.$qjimp.toImage(buffer).then(image => {
            return this.$qjimp.toBuffer(image, "image/jpeg").then(newBuffer => {
                let header = { 
                    "Content-Type": "image/jpeg",
                    "Expires": new Date(Date.now() + 604800000).toString(), /* 1000 * 60 * 60 * 24 * 7 (7 days)*/
                    "Etag": '"0.0.1"'
                };
                return response.send({ header: header, request: request, content: newBuffer })
            });
        });
    };
};

exports = module.exports = ApplicationService;