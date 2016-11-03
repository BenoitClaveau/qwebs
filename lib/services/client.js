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

    get(url, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            options.url = url;
            return request.get(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
 
    post(url, data, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            options.url = url;
            options.json = data;
            return request.post(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
 
    put(url, data, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            options.url = url;
            options.json = data;
            return request.put(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
 
    delete(url, data, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            options.url = url;
            options.json = data;
            return request.delete(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else resolve(httpResponse);
            });
        });
    };
};

exports = module.exports = ClientService;
