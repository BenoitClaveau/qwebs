# qwebs
Qwebs is a web server designed to be used with single page application framework

```js
/*!
 * qwebs service
 */
 
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
        return response.send({ request: request, content: results });
    });
};

ApplicationService.prototype.postHello = function (request, response, promise) {
    return promise.then(function (self) {
        var name = request.body.name;   //read data from body
        return response.send({ request: request, content: name });
    });
};

exports = module.exports = new ApplicationService();
```

```js
/*!
 * qwebs server
 */
"use strict";

var qwebs = require('qwebs'),
    applicationService = require('./services/applicationservice');

qwebs.init({
  config: {
    compress: false,   //deactivate html, css and javascript compression
    folder: "public"   //default assets folder  
  },
  bundles: {           //set bundles
    "/app.css": [{
      "css/app.css"
    }],
    "/app.js": [{
      'libs/angular-material.js',
      'libs/angular-route.js',
      "libs/app.js"
    }]
  }
});

qwebs.get('/').register(applicationService, "index");  //return a single page application template
qwebs.get('/api/:name').register(applicationService, "getHello"); 
qwebs.post('/api/name').register(applicationService, "postHello");

http.createServer(function (request, response) {
    return qwebs.invoke(request, response);
}).listen(3000);
```

## Features

  * Routing
  * Fully integrates promises
  * Assets are loaded into memory
  * OOP
  * Html, css and javascript minification
  * Images are not written to disk but in buffer
  * No template engine
  
## Installation

```bash
$ npm install qwebs
```
  