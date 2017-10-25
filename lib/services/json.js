/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

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
      if (this.isDate(value)) return new Date(value);
      return value;
    }

    isDate(value) {
      return DATE_PATTERN.test(value);
    }
};

exports = module.exports = JsonService;