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
    contentType = require("./contentType"),
    Sass = require("sass.js"),
    Q = require("q"),
    DataError = require("./dataerror");

function Asset (qwebs, route) {
    this.qwebs = qwebs;
    this.route = route;
    this.contentType = "";
    this.content = null;
    this.contentDeflate = null;
    this.contentGzip = null;
};

Asset.prototype.initFromFiles = function(filepathList) {
    var self = this;
    
    Q.try(function () {

        var ext = path.extname(self.route);
        self.contentType = contentType.getFromExt(ext);

        var atime = null;
        filepathList.forEach(function (filepath) {
            if (!fs.existsSync(filepath)) throw new DataError({ message: filepath + " doesn't exist." });
            var stats = fs.statSync(filepath);
            atime = Math.max(atime, stats.atime.getTime());
        });
        self.atime = atime;
        
        if (ext == ".css") return self.getCssBundle(filepathList);
        else if (ext == ".js") return self.getJsBundle(filepathList);
        else if (ext == ".html") return self.getHtmlBundle(filepathList);
        else if (ext == ".json") return self.getBundle(filepathList, { ext: ".json", encoding: "utf8" });
        return self.getBundle(filepathList);

    }).then(function (content) {
        if (!content) throw new DataError({ message: "Content is empty for " + self.route});
        
        self.content = content;
        return Q.ninvoke(zlib, "deflate", self.content).then(function (buffer) {
            self.contentDeflate = buffer;
            return Q.ninvoke(zlib, "gzip", self.content).then(function (buffer) {
                self.contentGzip = buffer;
            });
        });
    }).then(function () {
        //if (self.qwebs.config.verbose) console.log(self.toString());
        return self;
    }).catch(function (error) {
        throw new DataError({ message: "Failed to load asset.", error: error});
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
            if (typeof scssCompiled == "object") throw new DataError({ message: "Scss synthax error " + scssCompiled });
        }
        return self.getBundle(filepathList, { ext: ".css", encoding: "utf8" }).then(function (bundle) {
            if (scssCompiled) bundle += "\n" + scssCompiled;
            if (!self.qwebs.config.compress) return bundle;
            return new CleanCSS().minify(bundle).styles;
        });
    });
};
    
Asset.prototype.getJsBundle = function(filepathList) {
    var self = this;
    return self.getBundle(filepathList, { ext: ".js", encoding: "utf8" }).then(function (bundle) {
        if (!self.qwebs.config.compress) return bundle;
        
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
        if (!self.qwebs.config.compress) return bundle;
        var option = {
            "level": "strip",
            "leftDelimiter": "{%",
            "rightDelimiter": "%}"
        };
        return htmlCompress.compress(bundle, option);
    });
};

Asset.prototype.toString = function() {
    return this.route;
    //return "{ route: " + this.route + ", contentType: " + this.contentType + "}";
};

exports = module.exports = Asset;