# Qwebs
 Light, optimized [promise](https://www.npmjs.com/package/q) web server.

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]

 Qwebs is designed to be used with Single Page Application framework like Angular, React or Backbone.

## Features

  * [Promises](https://www.npmjs.com/package/q)
  * Http routing
  * Response
  * Dependency injection
  * Optimize memory usage
  * Css, Sass
  * Bundle
  * Html, css and javascript minification
  * No temporary image
  
### Promises

  * Easier to read
  * Easier to maintain in the future
  * Easier error handling

### Http routing

Our goal is to find the final route as fast as possible.
We use a tree data structure to represent all routes.

  * get(route, service, method)
  * post(route, service, method)
  * put(route, service, method)
  * delete(route, service, method)

```js
qwebs.get("/user/:id", "$users", "get"); 
qwebs.post("/user", "$users", "save");
```

### Response

Your response is automatically compressed with Gzip or Deflate.

  * response.send({request, statusCode, header, content})
    - [request](https://nodejs.org/api/http.html#http_class_http_clientrequest)
    - [statusCode](http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1)
    - [header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.2) 
    - content: json, jtml, ...
  
  * qwebs.invoke(request, response, overridenUrl)
    - Usefull to route to an asset 

### Dependency injection

Just declare the service name in your constructor.

```js
//services/user.js
function UserService($config) {
```

Qwebs will create your service with its dependencies.

```js
//server.js
qwebs.inject("$user", "./services/user");
```

### Optimize memory usage

All assets are loaded in memory at startup because we do not want read file during runtime.

### Css, Sass

We included a Sass preprocessor.
You don't need to compile your sass via an external program.

### Bundle (bundle.json)

Create your own css or js bundle.

 * js
 * css, scss

```json
{
    "/app.js":[
        "bower_components/angular-material/angular-material.js",
        "bower_components/angular-route/angular-route.js",
        "bower_components/angular-aria/angular-aria.js",
        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/angular-i18n/angular-locale_fr-fr.js",
        "bower_components/angular-animate/angular-animate.js",
        "web/app.js"
    ],
    "/app.css":[
        "assets/mixins.scss",
        "bower_components/angular-material/angular-material.css",
        "assets/master.scss"
    ]   
}
```

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel=stylesheet type="text/css" href="/app.css">
    </head>
    <body>
        <script src="/app.js"></script>
    </body>
</html>
```

### No temporary image

Uploaded images are not saved in temporary files. We prefer use data stream. $qjimp service is designed to read, manipulate image stream.

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

## Create your server

  * inject(service, location): inject your service, define a service name and the location of your package.
  * load(): resolve all services.
  * invoke(request, response): delegate the response to Qwebs.

```js
var Qwebs = require('qwebs');

var qwebs = new Qwebs();
qwebs.inject("$app", "./applicationservice");
qwebs.get('/', "$app", "getHelloworld"); 

qwebs.load().then(function() {
    http.createServer(function (request, response) {
        return qwebs.invoke(request, response).catch(function(error) {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
});
```
  
## Services

  * $config: your configuration.
  * $qwebs: qwebs instance.
  * $injector: resolve services at runtime.
  * $responseProxy: extand http.ServerResponse.
  * $response: default response extension.
  * $qjimp: convert and manipulate images.
  * $repository: load and retrieve files store in a folder.
  
## Others Services

  * [$mongo](https://www.npmjs.com/package/qwebs-mongo)
  * [$authentication](https://www.npmjs.com/package/qwebs-auth-jwt)
  * [$https](https://www.npmjs.com/package/qwebs-https)
  * [$nodemailer](https://www.npmjs.com/package/qwebs-nodemailer)

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

## Test

To run our tests, clone the Qwebs repo and install the dependencies.

```bash
$ git clone https://github.com/beny78/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd tests
$ node.exe "..\node_modules\jasmine-node\bin\jasmine-node" --verbose .
```

[npm-image]: https://img.shields.io/npm/v/qwebs.svg
[npm-url]: https://npmjs.org/package/qwebs
[travis-image]: https://travis-ci.org/beny78/qwebs.svg?branch=master
[travis-url]: https://travis-ci.org/beny78/qwebs
[coveralls-image]: https://coveralls.io/repos/beny78/qwebs/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/beny78/qwebs?branch=master
