/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const request = require('request');
const DataError = require("./../dataerror");
const JSONStream = require("JSONStream");

class ClientService {
    constructor() {
    };

    parse(httpResponse) {
       if (httpResponse.headers["content-type"].match(/\bapplication\/json\b/)) {
         if (httpResponse.body && typeof httpResponse.body === "string") {
            httpResponse.body = JSON.parse(httpResponse.body);
         }
       }
    };
 
    get(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.get(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else {
                  try {
                     this.parse(httpResponse);
                     resolve(httpResponse);
                  }
                  catch(error) {
                      reject(error);
                  }
                }
            });
        });
    };
 
    post(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.post(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else {
                  try {
                     this.parse(httpResponse);
                     resolve(httpResponse);
                  }
                  catch(error) {
                      reject(error);
                  }
                }
            });
        });
    };
 
    put(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.put(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else {
                  try {
                     this.parse(httpResponse);
                     resolve(httpResponse);
                  }
                  catch(error) {
                      reject(error);
                  }
                }
            });
        });
    };
 
    delete(options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            return request.delete(options, (err, httpResponse, body) => {
                if (err) reject(err);
                else {
                  try {
                     this.parse(httpResponse);
                     resolve(httpResponse);
                  }
                  catch(error) {
                      reject(error);
                  }
                }
            });
        });
    };
};

exports = module.exports = ClientService;
