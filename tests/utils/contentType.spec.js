/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const contentType = require('../../lib/utils/contentType');

describe("contentType", () => {

    it("getFromExt", done => {
        
        return Promise.resolve().then(() => {     
            expect(contentType.getFromExt(".json")).toEqual("application/json");
            expect(contentType.getFromExt(".png")).toEqual("image/png");
            expect(contentType.getFromExt(".jpg")).toEqual("image/jpg");
            expect(contentType.getFromExt(".gif")).toEqual("image/gif");
            expect(contentType.getFromExt(".svg")).toEqual("image/svg+xml");
            expect(contentType.getFromExt(".js")).toEqual("application/javascript");
            expect(contentType.getFromExt(".html")).toEqual("text/html");
            expect(contentType.getFromExt(".css")).toEqual("text/css");
            expect(contentType.getFromExt(".ico")).toEqual("image/x-icon");
            expect(contentType.getFromExt(".ttf")).toEqual("application/x-font-ttf");
            expect(contentType.getFromExt(".eot")).toEqual("application/vnd.ms-fontobject");
            expect(contentType.getFromExt(".woff")).toEqual("application/font-woff");
            expect(contentType.getFromExt(".appcache")).toEqual("text/cache-manifest");
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("getFromExt exception", done => {
        
        return Promise.resolve().then(() => {            
            expect(contentType.getFromExt(".mp3")).toEqual("audio/mpeg");
            fail();
        })
        .catch(error => {
            expect(error.stack).not.toBeNull();
        }).then(() => {
            done();
        });
    });
});