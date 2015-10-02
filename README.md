# qwebs
Qwebs is a promise web server designed to be used with single page application framework like Angular, React or Backbone.

## Create your own server

```js
var Qwebs = require('qwebs');

var qwebs = new Qwebs();

qwebs.inject("$app", "./applicationservice");

qwebs.get('/helloworld').register("$app", "getHelloworld"); 

qwebs.load().then(function() {
    http.createServer(function (request, response) {
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
});
```

## Define your service

```js
var Q = require('q');

function ApplicationService($config) {
    if ($config.verbose) console.log("ApplicationService created.");
};

ApplicationService.prototype.constructor = ApplicationService;

ApplicationService.prototype.getHelloworld = function (request, response, promise) {
    return promise.then(function (self) {
        var content = { message: "Hello World" };
        return response.send({ request: request, content: content });
    });
};

exports = module.exports = ApplicationService;
```

## Features

  * Promise
  * Http Routing
  * Injector
  * Optimize memory usage
  * Css, Sass
  * Optimise response size
  * Html, css and javascript minification
  * No temporary image
  
### Promise  

Qwebs is construct to be used with promise.
Your code will be easy to read and maintain in the future.

### Injector

Qwebs include a service injector.
You can easily access to every service.
Just declare the service name in your constructor.
```js
Ex: function MyService($config) {
```

### Optimize memory usage

Qwebs load all assets in memory.
No file are read during runtime.

### Css, Sass

Qwebs include a Sass preprocessor.
No need to compile your sass via an external program.

### Optimize response size

Qwebs Gzip or Deflate the response.

### Image

Qwebs will not save image stream as temporary file.
Because we do not want that Qwebs accesses the disk.

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



  