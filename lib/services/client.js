/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const request = require('request');
const DataError = require("./../dataerror");

class ClientService {
    constructor() {
    };

    post(url, data, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            options.json = data;
            return request.post(url, options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
};

exports = module.exports = ClientService;