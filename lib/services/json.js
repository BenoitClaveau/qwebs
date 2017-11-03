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

    stringify(value, replacer, space) {
      return JSON.stringify(value, replacer, space); //Could be overriden
    }

    parse(text) {
        return JSON.parse(text, this.reviver.bind(this))
    };

    reviver(key, value) {
      if (/^\d+$/.test(value)) return new Number(value);
      if (/^(true|false)$/.test(value)) return new Boolean(value);
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return new Date(value);
      return value;
    }
};

exports = module.exports = JsonService;