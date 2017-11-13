/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const { Transform } = require('stream');

class Stringify extends Transform {
    constructor(replacer, $json, objectMode = true, isArray = true) {
        super({ objectMode: objectMode });
        this.json = $json;
        this.op = '[';
        this.sep = ',';
        this.cl = ']';
        this.space = 4;
        this.replacer = replacer;
        this.first = true;
        this.any = false;
        this.isArray = isArray;
    };

    _transform(chunk, encoding, callback) {
        try {
            //const str = Buffer.isBuffer(chunk) ? chunk.toString(encoding) : chunk;
            const json = this.json.stringify(chunk, this.replacer, this.space);
            if (this.isArray) {
                if (this.first) { 
                    this.first = false; 
                    this.push(this.op)
                    this.push(json);
                    callback();
                }
                else {
                    this.push(this.sep)
                    this.push(json);
                    callback();
                }
            }
            else {
                callback(null, json);
            }
        } 
        catch (error) {
            callback(error);
        }
    }

    _flush(callback) {
        if(this.isArray) {
            if(this.first) this.push(this.op)
            this.push(this.cl);
        }
        callback();
      };

};

class JsonStreamService {
    constructor($json) {
        this.json = $json;
        this.replacer = null;
    }

    stringify(options = {}) {
        return new Stringify(options.replacer || this.replacer, this.json, options.objectMode, options.isArray);
    }
}

exports = module.exports = JsonStreamService;