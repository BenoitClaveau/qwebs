"use strict";

var Q = require('q');

function ApplicationService() {
};

ApplicationService.prototype.constructor = ApplicationService;

ApplicationService.prototype.index = function (request, response, promise) {
    return promise.then(function (self) {
        request.url = "/template.html";  //override route to display template.html from assets folder ('public')
        return qwebs.assets.invoke(request, response);
    });
};

ApplicationService.prototype.getHello = function (request, response, promise) {
    return promise.then(function (self) {
        var name = request.params.name;  //get data from url params
        content = { name: name };
        return response.send({ request: request, content: content });
    });
};

ApplicationService.prototype.postHello = function (request, response, promise) {
    return promise.then(function (self) {
        var name = request.body.name;   //read data from body
        return response.send({ request: request, content: name });
    });
};

exports = module.exports = new ApplicationService();