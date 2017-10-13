/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const fs = require("fs");
const path = require("path");
const WebError = require("./../WebError");

class LoaderLoader {
    constructor($qwebs) {
        if (!$qwebs) throw new WebError({ message: "$qwebs instance is not defined." });
        this.$qwebs = $qwebs;
    };

    readFileSync(filepath) {
        if (!filepath) return {};

        if (typeof filepath == "string") 
        {
            filepath = path.resolve(this.$qwebs.root, filepath);
            let str;
            try {
                str = fs.readFileSync(filepath);
            } 
            catch(error) {
                throw new WebError({ message: "Failed to read services.json.", data: { error: error.message, filepath: filepath }, stack: error.stack });
            }
            try {
                return JSON.parse(str);
            }
            catch(error) {
                throw new WebError({ message: "Failed to parse services.json.", data: { error: error.message, filepath: filepath }, stack: error.stack });
            }
        }
        else if (filepath instanceof Object) return filepath;
        throw new WebError({ message: "Type is not managed." });
    }
}

exports = module.exports = LoaderLoader;