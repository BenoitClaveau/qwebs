/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var DataError = require("./../dataerror");

function ContentTypeProvider() {
};

ContentTypeProvider.prototype.constructor = ContentTypeProvider;

ContentTypeProvider.prototype.getFromExt = function (ext) {
    if (ext == ".js") return "application/javascript";
    else if (ext == ".png") return "image/png";
    else if (ext == ".jpg") return "image/jpg";
    else if (ext == ".gif") return "image/gif";
    else if (ext == ".svg") return "image/svg+xml";
    else if (ext == ".html") return "text/html";
    else if (ext == ".css") return "text/css";
    else if (ext == ".ico") return "image/x-icon";
    else if (ext == ".ttf") return "application/x-font-ttf";
    else if (ext == ".eot") return "application/vnd.ms-fontobject";
    else if (ext == ".woff") return "application/font-woff";
    else if (ext == ".json") return "application/json";
    else if (ext == ".appcache") return "text/cache-manifest";
    else throw new DataError({ message: "Extension is not supported", data: { extension: ext }});
};

exports = module.exports = new ContentTypeProvider();