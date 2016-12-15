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
        return Promise.resolve().then(() => {
            let ext = path.extname(this.route);
            try {
                this.contentType = contentType.getFromExt(ext);
            }
            catch(error) {
                error.data.route = this.route; //extend data
                throw error;
            }
            for(let i = 0; i < filepathList.length; i++)
            {
                let filepath = filepathList[i] = path.resolve(this.$qwebs.root, filepathList[i]);
                if (!fs.existsSync(filepath)) throw new DataError({ message: "Asset file doesn't exist.", data: { file: filepath, route: this.route }});
            }
            if (ext == ".css") return this.getCssBundle(filepathList);
            else if (ext == ".js") return this.getJsBundle(filepathList);
            else if (ext == ".html") return this.getHtmlBundle(filepathList);
            else if (ext == ".json") return this.getBundle(filepathList, { ext: ".json", encoding: "utf8" });
            return this.getBundle(filepathList);
        }).then(content => {
            if (!content) throw new DataError({ message: "Asset content is empty.", data: { route: this.route }});
            this.content = content;
        }).then(content => {
            return new Promise((resolve, reject) => {
                zlib.deflate(this.content, (err, data) => {
                    if (err) reject(err);
                    else {
                        this.contentDeflate = data;
                        resolve();
                    }
                });
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

    getBundle(filepathList, options) {
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
        
    getCssBundle(filepathList) {
        return this.getBundle(filepathList, { ext: ".css", encoding: "utf8" }).then(css => {
            return this.getBundle(filepathList, { ext: ".scss", encoding: "utf8" }).then(scss => {
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
                if (!this.$config.compress) return bundle;
                return new CleanCSS().minify(bundle).styles;
            });
        });
    };
        
    getJsBundle(filepathList) {

        return this.getBundle(filepathList, { ext: ".js", encoding: "utf8" }).then(bundle => {
            if (!this.$config.compress) return bundle;
            
            let toplevel = UglifyJS.parse(bundle);
            toplevel.figure_out_scope();
            let compressor = UglifyJS.Compressor(); //({unused: false, dead_code:false});
            let compressed_ast = toplevel.transform(compressor);
            compressed_ast.figure_out_scope();
            compressed_ast.compute_char_frequency();
            compressed_ast.mangle_names();
            let stream = UglifyJS.OutputStream();
            compressed_ast.print(stream);
            return stream.toString(); // this is your minified code
        });
    };
        
    getHtmlBundle(filepathList) {

        return this.getBundle(filepathList, { ext: ".html", encoding: "utf8" }).then(bundle => {    
            if (!this.$config.compress) return bundle;
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
            if (!request) throw new DataError({ message: "Request is undefined.", data: { route: this.route}});
            if (!response) throw new DataError({ message: "Response is undefined.", data: { route: this.route}});
            if (!request.url) throw new DataError({ message: "Request.url is undefined.", data: { route: this.route}});
        
            if (!this.content) throw new DataError({ message: "Content is empty", data: { route: this.route}});
        
            let header = null;
            if (this.contentType.match(/text\/cache-manifest/ig)) {
                header = {
                    "Content-Type": this.contentType,
                    "Cache-Control": "no-cache",
                    "Expires": new Date(Date.now()).toUTCString()
                };
            }
            else {
                header = {
                    "Content-Type": this.contentType,
                    "Cache-Control": "no-cache",
                    "Expires": new Date(Date.now()).toUTCString()
                    // "Cache-Control": "private",
                    // "Expires": new Date(Date.now() + 10000).toUTCString(), /* 1000 * 60 * 60 * 24 * 7 (7 jours)*/
                };
            }
        
            return response.send({
                header: header,
                request: request,
                content: this.content,
                contentGzip: this.contentGzip,
                contentDeflate: this.contentDeflate
            });
        });
    };
};

exports = module.exports = Asset;
