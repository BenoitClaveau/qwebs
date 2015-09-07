/*!
 * qwebs server
 */
"use strict";

var qwebs = require('../../lib/qwebs'),
    applicationService = require('./applicationservice'),
    http = require('http'),
    request = require('request');

qwebs.init();

qwebs.get('/helloworld').register(applicationService, "getHelloWorld"); 

http.createServer(function (request, response) {
    return qwebs.invoke(request, response);
}).listen(1337, "127.0.0.1");