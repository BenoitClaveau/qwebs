/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

var path = require("path"),
    fs = require("fs"),
    zlib = require("zlib"),
    CleanCSS = require("clean-css"),
    UglifyJS = require("uglify-js"),
    htmlCompress = require("html-compress"),
    contentType = require("./../utils/contentType"),
    Sass = require("sass.js"),
    Q = require("q"),
    DataError = require("./../dataerror");

function Asset ($qwebs, $config, route) {
    this.$qwebs = $qwebs
    this.$config = $config;
    this.route = route;
    this.contentType = "";
    this.content = null;
    this.contentDeflate = null;
    this.contentGzip = null;
    
    if (!this.route) throw new DataError({ message: "Route is not defined." });
};

Asset.prototype.initFromFiles = function(filepathList) {
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
            throw new DataError({ message: "Deflate compression failed.", data: { route: self.route, error: error.message }});
        });
        
    }).then(function (content) {
        
        return Q.ninvoke(zlib, "gzip", self.content).then(function (buffer) {
                self.contentGzip = buffer;
        }).catch(function(error) {
            throw new DataError({ message: "Gzip compression failed.", data: { route: self.route, error: error.message }});
        });

    }).then(function () {
        return self;
    });
};

Asset.prototype.getBundle = function(filepathList, options) {
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
    
Asset.prototype.getCssBundle = function(filepathList) {
    var self = this;
    return self.getBundle(filepathList, { ext: ".scss", encoding: "utf8" }).then(function (scss) {
        var scssCompiled = null;
        if (scss) {
            scssCompiled = Sass.compile(scss);
            if (typeof scssCompiled == "object") throw new DataError({ message: "Scss synthax error", data: { error: scssCompiled, route: self.route }});
        }
        return self.getBundle(filepathList, { ext: ".css", encoding: "utf8" }).then(function (bundle) {
            if (scssCompiled) bundle += "\n" + scssCompiled;
            if (!self.$config.compress) return bundle;
            return new CleanCSS().minify(bundle).styles;
        });
    });
};
    
Asset.prototype.getJsBundle = function(filepathList) {
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
    
Asset.prototype.getHtmlBundle = function(filepathList) {
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

Asset.prototype.invoke = function(request, response) {
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

exports = module.exports = Asset;
