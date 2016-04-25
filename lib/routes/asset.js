/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlCompress = require("html-compress");
const contentType = require("./../utils/contentType");
const Sass = require("sass.js");
const Q = require("q");
const DataError = require("./../dataerror");

class Asset {
    constructor($qwebs, $config, route) {
        this.$qwebs = $qwebs
        this.$config = $config;
        this.route = route;
        this.contentType = "";
        this.content = null;
        this.contentDeflate = null;
        this.contentGzip = null;
        
        if (!this.route) throw new DataError({ message: "Route is not defined." });
    };

    initFromFiles(filepathList) {
        var self = this;
        
        return Q.try(function () {
            
            var ext = path.extname(self.route);
            self.contentType = contentType.getFromExt(ext);

            for(var i = 0; i < filepathList.length; i++)
            {
                var filepath = filepathList[i] = path.resolve(self.$qwebs.root, filepathList[i]);
                if (!fs.existsSync(filepath)) throw new DataError({ message: "Asset file doesn't exist.", data: { file: filepath, route: self.route }});
            }

            if (ext == ".css") return self.getCssBundle(filepathList);
            else if (ext == ".js") return self.getJsBundle(filepathList);
            else if (ext == ".html") return self.getHtmlBundle(filepathList);
            else if (ext == ".json") return self.getBundle(filepathList, { ext: ".json", encoding: "utf8" });
            return self.getBundle(filepathList);

        }).then(function (content) {

            if (!content) throw new DataError({ message: "Asset content is empty.", data: { route: self.route }});
            self.content = content;
            
        }).then(function (content) {
            
            return Q.ninvoke(zlib, "deflate", self.content).then(function (buffer) {
                self.contentDeflate = buffer;
            }).catch(function(error) {
                throw new DataError({ message: "Deflate compression failed.", data: { route: self.route, error: error.message }, stack: error.stack});
            });
            
        }).then(function (content) {
            
            return Q.ninvoke(zlib, "gzip", self.content).then(function (buffer) {
                    self.contentGzip = buffer;
            }).catch(function(error) {
                throw new DataError({ message: "Gzip compression failed.", data: { route: self.route, error: error.message }, stack: error.stack});
            });

        }).then(function () {
            return self;
        });
    };

    getBundle(filepathList, options) {
        return Q.try(function () {
            options = options || {};
            
            return filepathList.reduce(function (previous, current) {
                
                var ext1 = path.extname(current)
                if (options.ext && ext1 !== options.ext) return previous; //extension is filtered. We ignore it
                var content = fs.readFileSync(current, options.encoding);            
                return previous ? previous + "\n" + content : content;
            }, null);
        });
    };
        
    getCssBundle(filepathList) {
        var self = this;
        
        return self.getBundle(filepathList, { ext: ".css", encoding: "utf8" }).then(function (css) {
            return self.getBundle(filepathList, { ext: ".scss", encoding: "utf8" }).then(function (scss) {
                if (!css && !scss) throw new DataError({ message: "Css bundle is empty.", data: { route: self.route }});
                if (!scss) return css;
                
                var deferred = Q.defer();
                Sass.compile(scss, function(result) {
                    if (result.status) deferred.reject(new DataError({ message: "Scss compilation failed.", data: result }));
                    else deferred.resolve(result.text);
                });      
                return deferred.promise;           
            }).then(function(scssCompiled) {
                var bundle = css ? css + "\n": "";
                bundle += scssCompiled;
                return bundle;
            }).then(function(bundle) {
                if (!self.$config.compress) return bundle;
                return new CleanCSS().minify(bundle).styles;
            });
        });
    };
        
    getJsBundle(filepathList) {
        var self = this;
        
        return self.getBundle(filepathList, { ext: ".js", encoding: "utf8" }).then(function (bundle) {
            if (!self.$config.compress) return bundle;
            
            var toplevel = UglifyJS.parse(bundle);
            toplevel.figure_out_scope();
            var compressor = UglifyJS.Compressor(); //({unused: false, dead_code:false});
            var compressed_ast = toplevel.transform(compressor);
            compressed_ast.figure_out_scope();
            compressed_ast.compute_char_frequency();
            compressed_ast.mangle_names();
            var stream = UglifyJS.OutputStream();
            compressed_ast.print(stream);
            return stream.toString(); // this is your minified code
        });
    };
        
    getHtmlBundle(filepathList) {
        var self = this;
        
        return self.getBundle(filepathList, { ext: ".html", encoding: "utf8" }).then(function (bundle) {    
            if (!self.$config.compress) return bundle;
            var option = {
                "level": "strip",
                "leftDelimiter": "{%",
                "rightDelimiter": "%}"
            };
            return htmlCompress.compress(bundle, option);
        });
    };

    invoke(request, response) {
        var self = this;
        
        return Q.try(function() {
            if (!request) throw new DataError({ message: "Request is undefined.", data: { route: self.route}});
            if (!response) throw new DataError({ message: "Response is undefined.", data: { route: self.route}});
            if (!request.url) throw new DataError({ message: "Request.url is undefined.", data: { route: self.route}});
        
            if (!self.content) throw new DataError({ message: "Content is empty", data: { route: self.route}});
        
            var header = null;
            if (self.contentType.match(/text\/cache-manifest/ig)) {
                header = {
                    "Content-Type": self.contentType,
                    "Cache-Control": "no-cache",
                    "Expires": new Date(Date.now()).toUTCString()
                };
            }
            else {
                header = {
                    "Content-Type": self.contentType,
                    "Cache-Control": "no-cache",
                    "Expires": new Date(Date.now()).toUTCString()
                    // "Cache-Control": "private",
                    // "Expires": new Date(Date.now() + 10000).toUTCString(), /* 1000 * 60 * 60 * 24 * 7 (7 jours)*/
                };
            }
        
            return response.send({
                header: header,
                request: request,
                content: self.content,
                contentGzip: self.contentGzip,
                contentDeflate: self.contentDeflate
            });
        });
    };
};

exports = module.exports = Asset;
