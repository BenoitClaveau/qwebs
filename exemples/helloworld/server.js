"use strict";

var http = require("http"),
    Qwebs = require('../../lib/qwebs');

var qwebs = new Qwebs({});
qwebs.inject("$app", "./applicationservice");
qwebs.get('/', "$app", "getHelloWorld");
qwebs.get('/:test', "$app", "getHelloWorld2");
qwebs.get('/:test/info/:value', "$app", "getHelloWorld3"); 

qwebs.load().then(function() {
    http.createServer(function (request, response) {
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
}).catch(function(error) {
    console.log(error);
});