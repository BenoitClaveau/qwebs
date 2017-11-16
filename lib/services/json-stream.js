/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

const { UndefinedError } = require('oups');
const { Transform } = require('stream');
const JsonParser = require('jsonparse');

class Stringify extends Transform {
    constructor($json, objectMode = true, isArray = true) {
        if (!$json) throw new UndefinedError("$json");

        super({ objectMode });
        this.json = $json;
        this.isArray = isArray;

        this.op = '[';
        this.sep = ',';
        this.cl = ']';
        
        this.first = true;
    };

    _transform(chunk, encoding, callback) {
        try {
            const str = Buffer.isBuffer(chunk) ? chunk.toString(encoding) : chunk;
            const json = this.json.stringify(str);
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

class Parser extends Transform {
    constructor($json, objectMode = true) {
        if (!$json) throw new UndefinedError("$json");

        super({ objectMode })
        this.json = $json;

        this.parser = new JsonParser();
        let keys = [];

        //let current = {}
        this.parser.onValue = (value) => {

            if (this.parser.mode == JsonParser.C.ARRAY) {  //array mode
                if (this.parser.stack.length == 1) this.onObject(value);
                if (this.parser.stack.length > 1) this.parser.value[this.parser.key] = this.onOther(this.parser.key, value);
            }
            else {
                if (this.parser.stack.length == 0) this.onObject(value);
                else this.parser.value[this.parser.key] = this.onOther(this.parser.key, value);
            }
        }
    }

    _transform(chunk, encoding, callback) {
        this.parser.write(chunk);
        callback();
    }

    onValue(key, value) {
        return this.json.reviver(key, value);
    }

    onOther(key, value) {
        const type = typeof value;
        if (["string", "number", "boolean"].some(e => e == type)) return this.onValue(key, value);
        return value;
    }

    onObject(obj) {
        this.push(obj);
    }
}

class JsonStreamService {
    constructor($json) {
        if (!$json) throw new UndefinedError("$json");
        this.json = $json;
    }

    stringify(options = {}) {
        const { objectMode, isArray } = options;
        return new Stringify(this.json, objectMode, isArray);
    }

    parse(options = {}) {
        const { objectMode } = options;
        return new Parser(this.json, objectMode);
    }
}

exports = module.exports = JsonStreamService;