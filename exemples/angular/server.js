/*!
 * qwebs server
 */
"use strict";

var qwebs = require("../../lib/qwebs"),
    applicationService = require("./applicationservice"),
    http = require("http"),
    request = require("request");

qwebs.init({
    config: {
        folder: "public", //assets are defined in public folder
        compress: false,
        verbose: true
    },
    bundles: {
        "/app.js": ["./web/controller.js"]
    }    
}).then(function() {
    
    qwebs.get("/").register(applicationService, "index");
    qwebs.get("/cities").register(applicationService, "cities"); 
    qwebs.post("/city").register(applicationService, "city"); 
    
}).then(function() {

    http.createServer(function (request, response) {
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
});