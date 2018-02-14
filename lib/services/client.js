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

    request(options = {}) {
        return new Promise((resolve, reject) => {
            request(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
                    let { statusCode, headers, body } = httpResponse;
                    body = body || {};
                    reject(new HttpError(statusCode, "\nheaders: ${headers},\nbody: ${body}", { headers, body }));
                }
                else resolve(httpResponse);
            });
        });
    };

    get(options = {}) {
        return new Promise((resolve, reject) => {
            request.get(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
                    let { statusCode, headers, body } = httpResponse;
                    body = body || {};
                    reject(new HttpError(statusCode, "\nheaders: ${headers},\nbody: ${body}", { headers, body }));
                }
                else resolve(httpResponse);
            });
        });
    };
 
    post(options = {}) {
        return new Promise((resolve, reject) => {
            request.post(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
                    let { statusCode, headers, body } = httpResponse;
                    body = body || {};
                    reject(new HttpError(statusCode, "\nheaders: ${headers},\nbody: ${body}", { headers, body }));
                }
                else resolve(httpResponse);
            });
        });
    };
 
    put(options = {}) {
        return new Promise((resolve, reject) => {
            request.put(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
                    let { statusCode, headers, body } = httpResponse;
                    body = body || {};
                    reject(new HttpError(statusCode, "\nheaders: ${headers},\nbody: ${body}", { headers, body }));
                }
                else resolve(httpResponse);
            });
        });
    };

    patch(options = {}) {
        return new Promise((resolve, reject) => {
            request.patch(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
                    let { statusCode, headers, body } = httpResponse;
                    body = body || {};
                    reject(new HttpError(statusCode, "\nheaders: ${headers},\nbody: ${body}", { headers, body }));
                }
                else resolve(httpResponse);
            });
        });
    };
 
    delete(options = {}) {
        return new Promise((resolve, reject) => {
            request.delete(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
                    let { statusCode, headers, body } = httpResponse;
                    body = body || {};
                    reject(new HttpError(statusCode, "\nheaders: ${headers},\nbody: ${body}", { headers, body }));
                }
                else resolve(httpResponse);
            });
        });
    };
};

exports = module.exports = ClientService;
