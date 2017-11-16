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
        super({ objectMode })
        this.json = $json;

        this.parser = new JsonParser();
        let keys = [];
        this.parser.onValue = (value) => {
            if (this.parser.stack.length == 1) 
                this.onObject(value);
            else if (this.parser.value && this.parser.key)
                this.parser.value[this.parser.key] = this.onValue(this.parser.key, value);
        }
    }

    _transform(chunk, encoding, callback) {
        this.parser.write(chunk);
        callback();
    }

    onValue(key, value) {
        return this.json.reviver(key, value);
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