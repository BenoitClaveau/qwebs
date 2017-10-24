/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { Error } = require("oups");
const readFile = promisify(fs.readFile);

class LoaderLoader {
    constructor($qwebs) {
        if (!$qwebs) throw new Error("$qwebs instance is not defined.");
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
                throw new WebError("Failed to read ${file}.", { file: absoluteFilepath }, error);
            }
            try {
                return JSON.parse(str);
            }
            catch(error) {
                throw new Error("Failed to parse ${file}.", { file: absoluteFilepath }, error);
            }
        }
        throw new Error("${type} can't be loaded.", { type: typeof filepath });
    }
}

exports = module.exports = LoaderLoader;