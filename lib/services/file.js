/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const statFile = promisify(fs.statFile);

class File {
    constructor($qwebs) {
        if (!$qwebs) throw new Error("$qwebs instance is not defined.");
        this.$qwebs = $qwebs;
    };

    async readFile(filepath) {
        if (typeof filepath == "string") 
        {
            const absoluteFilepath = path.resolve(this.$qwebs.root, filepath);
            try {
                return await readFile(absoluteFilepath);
            } 
            catch(error) {
                throw new Error("Failed to read ${file}.", { file: absoluteFilepath }, error);
            }
        }
        throw new Error("filepath is not a string.", { type: typeof filepath });
    }

    async load(filepath) {
        if (!filepath) return Promise.resolve({});
        if (filepath instanceof Object) return Promise.resolve(filepath);
        const file = await this.readFile(filepath);
        try {
            return JSON.parse(file);
        }
        catch(error) {
            throw new Error("Failed to parse ${file}.", { file: filepath }, error);
        }
    }
}

exports = module.exports = File;