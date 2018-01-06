/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const request = require('request');
const { Error, HttpError } = require("oups");

class ClientService {
    constructor() {
    };

    request(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            request(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new HttpError(httpResponse.statusCode, httpResponse.statusMessage, { response: httpResponse, body: body }));
                else resolve(httpResponse);
            });
        });
    };

    get(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            request.get(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new HttpError(httpResponse.statusCode, httpResponse.statusMessage, { response: httpResponse, body: body }));
                else resolve(httpResponse);
            });
        });
    };
 
    post(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            request.post(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new HttpError(httpResponse.statusCode, httpResponse.statusMessage, { response: httpResponse, body: body }));
                else resolve(httpResponse);
            });
        });
    };
 
    put(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            request.put(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new HttpError(httpResponse.statusCode, httpResponse.statusMessage, { response: httpResponse, body: body }));
                else resolve(httpResponse);
            });
        });
    };

    patch(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            request.patch(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new HttpError(httpResponse.statusCode, httpResponse.statusMessage, { response: httpResponse, body: body }));
                else resolve(httpResponse);
            });
        });
    };
 
    delete(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            request.delete(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) reject(new HttpError(httpResponse.statusCode, httpResponse.statusMessage, { response: httpResponse, body: body }));
                else resolve(httpResponse);
            });
        });
    };
};

exports = module.exports = ClientService;
