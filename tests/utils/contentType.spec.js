/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const contentTypeExtractor = require('../../lib/utils/contentType');

describe("contentType", () => {

    it("getFromExt", done => {
        
        return Promise.resolve().then(() => {     
            expect(contentTypeExtractor.getFromExt(".json")).toEqual("application/json");
            expect(contentTypeExtractor.getFromExt(".png")).toEqual("image/png");
            expect(contentTypeExtractor.getFromExt(".jpg")).toEqual("image/jpg");
            expect(contentTypeExtractor.getFromExt(".gif")).toEqual("image/gif");
            expect(contentTypeExtractor.getFromExt(".svg")).toEqual("image/svg+xml");
            expect(contentTypeExtractor.getFromExt(".js")).toEqual("application/javascript");
            expect(contentTypeExtractor.getFromExt(".html")).toEqual("text/html");
            expect(contentTypeExtractor.getFromExt(".css")).toEqual("text/css");
            expect(contentTypeExtractor.getFromExt(".ico")).toEqual("image/x-icon");
            expect(contentTypeExtractor.getFromExt(".ttf")).toEqual("application/x-font-ttf");
            expect(contentTypeExtractor.getFromExt(".eot")).toEqual("application/vnd.ms-fontobject");
            expect(contentTypeExtractor.getFromExt(".woff")).toEqual("application/font-woff");
            expect(contentTypeExtractor.getFromExt(".appcache")).toEqual("text/cache-manifest");
        })
        .catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("getFromExt exception", done => {
        
        return Promise.resolve().then(() => {            
            expect(contentTypeExtractor.getFromExt(".mp3")).toEqual("audio/mpeg");
            fail();
        })
        .catch(error => {
            expect(error.stack).not.toBeNull();
        }).then(() => {
            done();
        });
    });
});