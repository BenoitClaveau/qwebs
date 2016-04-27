"use strict";

const http = require("http");
const Qwebs = require('../../lib/qwebs');

let qwebs = new Qwebs({});
qwebs.inject("$app", "./applicationservice");
qwebs.get('/', "$app", "getHelloWorld");

qwebs.load().then(() => {
    http.createServer((request, response) => {
        return qwebs.invoke(request, response).catch(error => {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
}).catch(error => {
    console.log(error);
});