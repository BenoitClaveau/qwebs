/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlCompress = require("html-compress");
const contentTypeExtractor = require("./../utils/contentType");
const Sass = require("sass.js");
const DataError = require("./../dataerror");

class Asset {
    constructor($qwebs, $config, route, contentType) {
        if (!route) throw new DataError({ message: "Route is not defined." });
        
        this.$qwebs = $qwebs
        this.$config = $config;
        this.route = route;
        this.content = null;
        this.contentDeflate = null;
        this.contentGzip = null;
        if (contentType) this.contentType = contentType;
        else {
            let ext = path.extname(this.route);
            try {
                this.contentType = contentTypeExtractor.getFromExt(ext);
            }
            catch(error) {
                console.warn(error.message, error.data.extension, this.route);
            }
        };
    };

    initFromFile(filepath) {
        return this.initFromFiles([filepath]);
    };

    initFromFiles(filepathList) {
        return Promise.resolve().then(() => {
            if (!filepathList) throw new DataError({ message: "filepathList is empty.", data: { filepathList: filepathList, route: this.route }});
            if (!Array.isArray(filepathList)) throw new DataError({ message: "filepathList must be an array.", data: { filepathList: filepathList, route: this.route }});

            for(let i = 0; i < filepathList.length; i++)
            {
                let filepath = filepathList[i] = path.resolve(this.$qwebs.root, filepathList[i]);
                if (!fs.existsSync(filepath)) throw new DataError({ message: "Asset file doesn't exist.", data: { file: filepath, route: this.route }});
            }
            switch(this.contentType) {
                case "text/css": return this._getCssBundle(filepathList);
                case "application/javascript": return this._getJsBundle(filepathList);
                case "text/html": return this._getHtmlBundle(filepathList);
                case "application/json": return this._getBundle(filepathList, { encoding: "utf8" });
                default: return this._getBundle(filepathList);
            }
        }).then(content => {
            return this._init(content);
        });
    };
    
    _init(content) {
        return Promise.resolve().then(() => {
            if (!content) throw new DataError({ message: "Asset content is empty.", data: { route: this.route }});
            this.content = content;
            return this._compress();
        });
    };

    _compress() {
        return new Promise((resolve, reject) => {
            zlib.deflate(this.content, (err, data) => {
                if (err) reject(err);
                else {
                    this.contentDeflate = data;
                    resolve();
                }
            });
        }).then(content => {
            return new Promise((resolve, reject) => {
                zlib.gzip(this.content, (err, data) => {
                    if (err) reject(err);
                    else {
                        this.contentGzip = data;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return this;
        });
    };

    _getBundle(filepathList, options) {
        return Promise.resolve().then(() => {
            options = options || {};
            return filepathList.reduce((previous, current) => {
                let ext1 = path.extname(current)
                if (options.ext && ext1 !== options.ext) return previous; //extension is filtered. We ignore it
                let content = fs.readFileSync(current, options.encoding);            
                return previous ? previous + "\n" + content : content;
            }, null);
        });
    };
        
    _getCssBundle(filepathList) {
        return this._getBundle(filepathList, { ext: ".css", encoding: "utf8" }).then(css => {
            return this._getBundle(filepathList, { ext: ".scss", encoding: "utf8" }).then(scss => {
                if (!css && !scss) throw new DataError({ message: "Css bundle is empty.", data: { route: this.route }});
                if (!scss) return css;
                
                return new Promise((resolve, reject) => {
                    Sass.compile(scss, result => {
                        if (result.status) reject(new DataError({ message: "Scss compilation failed.", data: result }));
                        else resolve(result.text);
                    });
                });
            }).then(scssCompiled => {
                let bundle = css ? css + "\n": "";
                bundle += scssCompiled;
                return bundle;
            }).then(bundle => {
                if (!this.$config._compress) return bundle;
                return new CleanCSS().minify(bundle).styles;
            });
        });
    };
        
    _getJsBundle(filepathList) {
        return this._getBundle(filepathList, { ext: ".js", encoding: "utf8" }).then(bundle => {
            if (!this.$config._compress) return bundle;
            
            let toplevel = UglifyJS.parse(bundle);
            toplevel.figure_out_scope();
            let _compressor = UglifyJS._compressor(); //({unused: false, dead_code:false});
            let _compressed_ast = toplevel.transform(_compressor);
            _compressed_ast.figure_out_scope();
            _compressed_ast.compute_char_frequency();
            _compressed_ast.mangle_names();
            let stream = UglifyJS.OutputStream();
            _compressed_ast.print(stream);
            return stream.toString(); // this is your minified code
        });
    };
        
    _getHtmlBundle(filepathList) {
        return this._getBundle(filepathList, { ext: ".html", encoding: "utf8" }).then(bundle => {    
            if (!this.$config._compress) return bundle;
            let option = {
                "level": "strip",
                "leftDelimiter": "{%",
                "rightDelimiter": "%}"
            };
            return htmlCompress.compress(bundle, option);
        });
    };

    invoke(request, response) {
        return Promise.resolve().then(() => {
            
            if (!this.content) throw new DataError({ message: "Content is empty", data: { route: this.route }});
            if (!this.contentType) throw new DataError({ message: "ContentType is undefined", data: { route: this.route }});
            if (!this.contentGzip) throw new DataError({ message: "contentGzip is undefined", data: { route: this.route }});
            if (!this.contentDeflate) throw new DataError({ message: "contentDeflate is undefined", data: { route: this.route }});
        
            let headers = null;
            if (this.contentType.match(/text\/cache-manifest/ig)) {
                headers = {
                    "Content-Type": this.contentType,
                    "Cache-Control": "no-cache",
                    "Expires": new Date(Date.now()).toUTCString()
                };
            }
            else {
                headers = {
                    "Content-Type": this.contentType,
                    "Cache-Control": "no-cache",
                    "Expires": new Date(Date.now()).toUTCString()
                    // "Cache-Control": "private",
                    // "Expires": new Date(Date.now() + 10000).toUTCString(), /* 1000 * 60 * 60 * 24 * 7 (7 jours)*/
                };
            }
        
            return response.send({
                headers: headers,
                request: request,
                content: this.content,
                contentGzip: this.contentGzip,
                contentDeflate: this.contentDeflate
            });
        });
    };
};

exports = module.exports = Asset;
