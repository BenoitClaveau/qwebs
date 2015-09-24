/*!
 * qwebs server
 */
"use strict";

var qwebs = require("../../lib/qwebs").configure(),  //read config.json
    applicationService = require("./applicationservice"),
    http = require("http"),
    request = require("request");
 
qwebs.get("/").register(applicationService, "index");
qwebs.get("/cities").register(applicationService, "cities"); 
qwebs.post("/city").register(applicationService, "city"); 
    
qwebs.init().then(function() {
    http.createServer(function (request, response) {
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
});