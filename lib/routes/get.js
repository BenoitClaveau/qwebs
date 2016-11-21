/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const url = require("url");
const DataError = require("./../dataerror");

class Get {
    constructor($qwebs, route) {
        this.$qwebs = $qwebs;
        this.route = route;
        this.contentType = null;
        this.serviceName = null;
        this.methodName = null;
        this.method = null;
    };

    register(serviceName, methodName) {
        if (!serviceName) throw new DataError({ message: "Service is not defined.", data: { route: this.route }});
        if (!methodName) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});

        this.serviceName = serviceName;
        this.methodName = methodName;

        return this;
    };

    load() {
        this.service = this.$qwebs.resolve(this.serviceName);
        this.method = this.service[this.methodName];
        if (!this.method) throw new DataError({ message: "Method is not defined.", data: { service: this.serviceName, method: this.methodName }});
    };

    invoke (request, response) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.method) throw new DataError({ message: "Service is not defined.", data: { route: this.route }});
                if (!this.service) throw new DataError({ message: "Method is not defined.", data: { route: this.route }});

                let p = this.method.call(this.service, request, response, reject);
                if (p instanceof Promise) { 
                    return p.then(resolve).catch(error => {
                        if (error.name !== "DataError") error = new DataError({ message: error.message, stack: error.stack });
                        reject(error);
                    });
                }
                else resolve(p);
            }
            catch (error) {
                if (error.name !== "DataError") error = new DataError({ message: error.message, stack: error.stack });
                reject(error);
            }  
        });
    };
};

exports = module.exports = Get;
