/*!
 * qwebs server
 */
"use strict";

var qwebs = require('../../lib/qwebs').configure(),
    applicationService = require('./applicationservice'),
    http = require('http'),
    request = require('request');

qwebs.get('/helloworld').register(applicationService, "getHelloWorld"); 

qwebs.init().then(function() {
    http.createServer(function (request, response) {
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
});