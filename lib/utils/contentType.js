/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const DataError = require("./../dataerror");

class ContentTypeProvider {
    constructor() {
    };
    
    getFromExt(ext) {
        switch (ext) {
            case ".js": return "application/javascript";
            case ".png": return "image/png";
            case ".jpg": return "image/jpg";
            case ".gif": return "image/gif";
            case ".svg": return "image/svg+xml";
            case ".html": return "text/html";
            case ".css": return "text/css";
            case ".ico": return "image/x-icon";
            case ".ttf": return "application/x-font-ttf";
            case ".eot": return "application/vnd.ms-fontobject";
            case ".woff": return "application/font-woff";
            case ".json": return "application/json";
            case ".appcache": return "text/cache-manifest";
            default: throw new DataError({ message: "Extension is not supported", data: { extension: ext }});
        };
    };
};

exports = module.exports = new ContentTypeProvider();