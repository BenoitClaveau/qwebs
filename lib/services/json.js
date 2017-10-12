/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const WebError = require("./../WebError");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * JSON is define as a service to easily orverride it. 
 * Inject yours in routes.json
 */
class JsonService {
    constructor() {
    };

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
