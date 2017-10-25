/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const expect = require("expect.js");
const ContentType = new require('../../lib/services/content-type');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("ContentType", () => {

    it("getFromExt", done => {
        const contentType = new ContentType();
        contentType.getFromExt(".json").expect("application/json");
        contentType.getFromExt(".png").expect("image/png");
        contentType.getFromExt(".jpg").expect("image/jpg");
        contentType.getFromExt(".gif").expect("image/gif");
        contentType.getFromExt(".svg").expect("image/svg+xml");
        contentType.getFromExt(".js").expect("application/javascript");
        contentType.getFromExt(".html").expect("text/html");
        contentType.getFromExt(".css").expect("text/css");
        contentType.getFromExt(".ico").expect("image/x-icon");
        contentType.getFromExt(".ttf").expect("application/x-font-ttf");
        contentType.getFromExt(".eot").expect("application/vnd.ms-fontobject");
        contentType.getFromExt(".woff").expect("application/font-woff");
        contentType.getFromExt(".appcache").expect("text/cache-manifest");
        contentType.getFromExt(".txt").expect("text/plain");
        contentType.getFromExt(".xml").expect("application/xml");
        contentType.getFromExt(".map").expect("application/json");
        contentType.getFromExt(".md").expect("text/x-markdown");
        contentType.getFromExt(".apk").expect("application/vnd.android.package-archive");
    });
});
