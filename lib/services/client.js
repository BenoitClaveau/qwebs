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

    get(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.get(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
 
    post(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.post(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
 
    put(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.put(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
 
    delete(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.delete(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
};

exports = module.exports = ClientService;
