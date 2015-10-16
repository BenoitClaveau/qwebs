"use strict";

var http = require("http"),
    Qwebs = require('../../lib/qwebs');

var qwebs = new Qwebs({});
qwebs.inject("$app", "./applicationservice");
qwebs.get("/", "$app", "index");
qwebs.get("/cities", "$app", "cities"); 
qwebs.post("/city", "$app", "city"); 
qwebs.post("/image", "$app", "toJpeg"); 

qwebs.load().then(function() {
    http.createServer(function (request, response) {
        
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
}).catch(function(error) {
    console.log(error);
});