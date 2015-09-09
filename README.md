# qwebs
Qwebs is a web server designed to be used with single page application framework like Angular, React or Backbone.

## Create your own server
```js
var qwebs = require('../../lib/qwebs'),
    applicationService = require('./applicationservice'),
    http = require('http'),
    request = require('request');

qwebs.init();

qwebs.get('/helloworld').register(applicationService, "getHelloworld"); 

http.createServer(function (request, response) {
    return qwebs.invoke(request, response);
}).listen(1337, "127.0.0.1");
```

## Define your service
```js
var Q = require('q');

function ApplicationService() {
};

ApplicationService.prototype.constructor = ApplicationService;

ApplicationService.prototype.getHelloworld = function (request, response, promise) {
    return promise.then(function (self) {
        var content = { message: "Hello World" };
        return response.send({ request: request, content: content });
    });
};

exports = module.exports = new ApplicationService();
```

## Features

  * Http Routing
  * Promise
  * Optimize memory usage
  * Services injection management
  * Use Css or Sass
  * Deflate or gzip response
  * Html, css and javascript minification
  * Image as stream
  
## Installation

```bash
$ npm install qwebs
```

## Examples

To run our examples, clone the Qwebs repo and install the dependencies.

```bash
$ git clone https://github.com/beny78/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd exemples/helloworld
$ node server.js
```



  