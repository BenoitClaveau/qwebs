/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

/**
 * JSON is define as a service to easily orverride it. 
 * Inject in yours services.json
 */
class JsonService {

    stringify(value) {
      return JSON.stringify(value, (key, value) => this.replacer(key, value), 4); 
    }

    parse(text) {
        return JSON.parse(text, (key, value) => this.reviver(key, value))
    };

    reviver(key, value) {
      const type = typeof value;
      if (["string", "number", "boolean"].some(e => e == type)) return this.onValue(key, value);
      return value;
    }

    onValue(key, value) {
      if (/^false$/.test(value)) return false;
      if (/^true$/.test(value)) return true;
      if (value != "" && !Number.isNaN(+value)) return +value;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return new Date(value);
      return value;
    }

    replacer(key, value) {
      // if (!value) return value;

      // if (value.constructor == Object) return value;
      // if (value.constructor == Array) return value;
      // if (value.constructor == Number) return value;
      // if (value.constructor == RegExp) return value.toString();
      // if (value.constructor == String) return value;
      // if (value.constructor == Date) return value;
      // if (value.constructor == Boolean) return value;
      // if (value.constructor == Error) return value;
      return value;
    }
};

exports = module.exports = JsonService;