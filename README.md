# Qwebs
 Light and optimized [promise](https://www.npmjs.com/package/q) web server.

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]
 [![NPM Download][npm-image-download]][npm-url]
 [![Dependencies Status][david-dm-image]][david-dm-url]

 Qwebs is designed to be used with Single Page Application framework like [Angular](https://angularjs.org/), [React](https://facebook.github.io/react/) or [Backbone](http://backbonejs.org/).

## Features

  * [Promise](#promise) 
  * [Separate routes and services](#service) 
  * [Dependency injection](#di) 
  * [Compression & minification](#bundle) 
  * 0 disk access at runtime
  * Bundle css, [sass](https://www.npmjs.com/package/node-sass)

<a name="service"/>
## Define your service

```js
class ApplicationService {
    constructor($config) {
        if ($config.verbose) console.log("ApplicationService created.");
    };

    get(request, response) {
        let content = { message: "Hello World" };   //javascript object
        return response.send({ request: request, content: content });
    };

    stream(request, response, reject) {
        let stream = fs.createReadStream('file.txt')  //stream
                       .on("error", reject)           //reject Promise
                       .pipe(new ToUpperCase())       //transform
                       .on("error", reject)           //reject Promise
        return response.send({ request: request, stream: stream });
    };
};

exports = module.exports = ApplicationService;
```

<a name="server"/>
## Create your server

```js
const Qwebs = require('qwebs');

let qwebs = new Qwebs();
qwebs.load().then(() => {
    http.createServer((request, response) => {
        qwebs.invoke(request, response).catch(error => {
            console.log(error);
        });
    }).listen(1337, "127.0.0.1");
});
```

### Routing

Our goal is to find the final route as fast as possible.
We use a tree data structure to represent all routes.

  * get(route, service, method)
  * post(route, service, method)
  * put(route, service, method)
  * delete(route, service, method)

```js
qwebs.get("/user/:id", "$users", "get"); 
qwebs.post("/user", "$users", "save");
...
```

<a name="di"/>
### Dependency injection

Just declare the service name in your constructor.

```js
//services/user.js
class UserService {
    constructor($config)
```

Qwebs will create your service with its dependencies.

```js
//server.js
qwebs.inject("$user", "./services/user");
```

### Response

Your response is automatically compressed with Gzip or Deflate.

  * response.send({request, statusCode, header, content, stream})
    - [request](https://nodejs.org/api/http.html#http_class_http_clientrequest)
    - [statusCode](http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1)
    - [header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.2) 
    - content: js, html, json, ... *(call response.write(content))*
    - or
    - [stream](https://nodejs.org/api/stream.html) *(call stream.pipe(response))*
  
  * qwebs.invoke(request, response, overridenUrl)
    - Usefull to route to an asset
   
$response sevice could be overridden

```js
//services/myresponse.js
"use strict";

const DataError = require("qwebs").DataError;
const ResponseService = require("qwebs/lib/services/response");

class MyResponseService extends ResponseService {
    constructor() {
        super();
    };

    send(response, data) {
        return Promise.resolve().then(() => {
            if (data == undefined) throw new DataError({ message: "No data." });
            if (data.header == undefined) data.header = {};
            
            data.header["Cache-Control"] = data.header["Cache-Control"] || "private";
            data.header["Expires"] = data.header["Expires"] || new Date(Date.now() + 3000).toUTCString(); /* 1000 * 3 (3 secondes)*/
            return super.send(response, data);
        });
    };
};

exports = module.exports = MyResponseService;
```

Replace $response service in $injector before load Qwebs.

```js
qwebs.inject("$response", "./services/myresponse");
```

### Avoid disk access at runtime

All assets are loaded in memory at startup.
Uploaded images are not saved in temporary files. $qjimp service is designed to read, manipulate image stream.

<a name="bundle"/>
### Bundle (bundle.json)

Create your own css or js bundle.
Qwebs includes a [Sass](https://www.npmjs.com/package/node-sass) preprocessor. You don't need to compile your sass via an external program.

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

<a name="promise"/>
## Promise

  * Easier to read
  * Easier to maintain in the future
  * Easier error handling

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
$ git clone https://github.com/BenoitClaveau/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd exemples/helloworld
$ node server.js
```

## Test

To run our tests, clone the Qwebs repo and install the dependencies.

```bash
$ git clone https://github.com/BenoitClaveau/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd tests
$ node.exe "..\node_modules\jasmine-node\bin\jasmine-node" --verbose .
```

[npm-image]: https://img.shields.io/npm/v/qwebs.svg
[npm-image-download]: https://img.shields.io/npm/dm/qwebs.svg
[npm-url]: https://npmjs.org/package/qwebs
[travis-image]: https://travis-ci.org/BenoitClaveau/qwebs.svg?branch=master
[travis-url]: https://travis-ci.org/BenoitClaveau/qwebs
[coveralls-image]: https://coveralls.io/repos/BenoitClaveau/qwebs/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/BenoitClaveau/qwebs?branch=master
[david-dm-image]: https://david-dm.org/BenoitClaveau/qwebs/status.svg
[david-dm-url]: https://david-dm.org/BenoitClaveau/qwebs
