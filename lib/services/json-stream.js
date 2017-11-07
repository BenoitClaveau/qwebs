/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";


const { Transform } = require('stream');

class Stringify extends Transform {
    constructor(replacer, space, $json) {
        super({ objectMode: true });
        this.$json = $json;
        this.op = '[';
        this.sep = ',';
        this.cl = ']';
        this.space = space;
        this.replacer = replacer;
        this.first = true;
        this.any = false;
    };

    _transform(chunk, encoding, callback) {

        try {
            const json = this.$json.stringify(chunk, this.replacer, this.space);
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
        catch (error) {
            callback(error);
        }
    }

    _flush(callback) {
        if(this.first) this.push(this.op)
        this.push(this.cl);
        callback();
      };

};

class JsonStreamService {
    constructor($json) {
        this.$json = $json;
        this.space = 4;
        this.replacer = null;
    }

    get stringify() {
        return new Stringify(this.replacer, this.space, this.$json);
    }
}

exports = module.exports = JsonStreamService;