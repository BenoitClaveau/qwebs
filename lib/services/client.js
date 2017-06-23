/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
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
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new DataError({ statusCode: httpResponse.statusCode, message: httpResponse.statusMessage, data: { response: httpResponse }}));
                else resolve(httpResponse);
            });
        });
    };
 
    post(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.post(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new DataError({ statusCode: httpResponse.statusCode, message: httpResponse.statusMessage, data: { response: httpResponse }}));
                else resolve(httpResponse);
            });
        });
    };
 
    put(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.put(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new DataError({ statusCode: httpResponse.statusCode, message: httpResponse.statusMessage, data: { response: httpResponse }}));
                else resolve(httpResponse);
            });
        });
    };

    patch(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.patch(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new DataError({ statusCode: httpResponse.statusCode, message: httpResponse.statusMessage, data: { response: httpResponse }}));
                else resolve(httpResponse);
            });
        });
    };
 
    delete(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.delete(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new DataError({ statusCode: httpResponse.statusCode, message: httpResponse.statusMessage, data: { response: httpResponse }}));
                else resolve(httpResponse);
            });
        });
    };
};

exports = module.exports = ClientService;
