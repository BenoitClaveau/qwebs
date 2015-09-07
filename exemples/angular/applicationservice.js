/*!
 * qwebs service
 */
"use strict";

var qwebs = require('../../lib/qwebs'), 
    Q = require('q');


function ApplicationService() {
    this.data = [
        {name: "Paris"},
        {name: "Lyon"},
        {name: "Marseille"}
    ];
};

ApplicationService.prototype.constructor = ApplicationService;

ApplicationService.prototype.index = function (request, response, promise) {
    return promise.then(function (self) {
        request.url = "/template.html";  //override route to display template.html from assets folder ('public')
        return qwebs.assets.invoke(request, response);
    });
};

ApplicationService.prototype.cities = function (request, response, promise) {
    return promise.then(function (self) {
        return response.send({ request: request, content: self.data });
    });
};

ApplicationService.prototype.city = function (request, response, promise) {
    return promise.then(function (self) {
        self.data.push(request.body);
        return response.send({ request: request, content: request.body });
    });
};

exports = module.exports = new ApplicationService();