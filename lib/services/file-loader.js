/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const WebError = require("./../WebError");
const readFile = promisify(fs.readFile);

class LoaderLoader {
    constructor($qwebs) {
        if (!$qwebs) throw new WebError({ message: "$qwebs instance is not defined." });
        this.$qwebs = $qwebs;
    };

    async load(filepath) {
        if (!filepath) return Promise.resolve({});
        if (filepath instanceof Object) return Promise.resolve(filepath);
        if (typeof filepath == "string") 
        {
            const absoluteFilepath = path.resolve(this.$qwebs.root, filepath);
            let str;
            try {
                str = await readFile(absoluteFilepath);
            } 
            catch(error) {
                throw new WebError("Failed to read services.json.", error);
            }
            try {
                return JSON.parse(str);
            }
            catch(error) {
                throw new WebError({ message: "Failed to parse services.json.", data: { error: error.message, filepath: absoluteFilepath }, stack: error.stack });
            }
        }
        throw new WebError({ message: "Type is not managed." });
    }
}

exports = module.exports = LoaderLoader;