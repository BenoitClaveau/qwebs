/*!
 * qwebs service
 */
"use strict";

var Q = require('q');

function ApplicationService() {
};

ApplicationService.prototype.constructor = ApplicationService;

ApplicationService.prototype.getHelloWorld = function (request, response) {
    var content = { message: "Hello World" };
    return response.send({ request: request, content: content });
};

exports = module.exports = ApplicationService;