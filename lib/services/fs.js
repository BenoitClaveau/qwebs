/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");
const fs = require("fs");
const p = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const statSync = promisify(fs.statSync);

class FileSystem {
    constructor($qwebs) {
        if (!$qwebs) throw new Error("$qwebs instance is not defined.");
        this.$qwebs = $qwebs;
    };

    absolutePath(path) {
        return p.resolve(this.$qwebs.root, path);
    }

    async readFile(path, options) {
        if (typeof path == "string") 
        {
            const absolutepath = this.absolutePath(path);
            try {
                return readFile(absolutepath, options);
            } 
            catch(error) {
                throw new Error("Failed to read ${path}.", { path: absolutepath }, error);
            }
        }
        throw new Error("Path is not a string.", { type: typeof path });
    }

    async statSync(path, options) {
        if (typeof path == "string") 
        {
            const absolutepath = this.absolutePath(path);
            try {
                return statSync(absolutepath, options);
            } 
            catch(error) {
                throw new Error("Failed to stat ${path}.", { path: absolutepath }, error);
            }
        }
        throw new Error("Path is not a string.", { type: typeof path });
    }

    async load(path) {
        if (!path) return Promise.resolve({});
        if (path instanceof Object) return Promise.resolve(path);
        const file = await this.readFile(path);
        try {
            return JSON.parse(file);
        }
        catch(error) {
            throw new Error("Failed to parse ${file}.", { file }, error);
        }
    }
}

exports = module.exports = FileSystem;