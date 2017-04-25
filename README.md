# Qwebs
 Web application framework with native promise, dependency-injection and bundle.

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]
 [![NPM Download][npm-image-download]][npm-url]
 [![Dependencies Status][david-dm-image]][david-dm-url]

 Discover our [starter kit](https://www.npmjs.com/package/qwebs-starter-kit-polymer) with [Polymer](https://www.polymer-project.org/).

## Create your server

```js
const Qwebs = require('qwebs');

let qwebs = new Qwebs();
qwebs.load();
```

## Features

  * [Promise](#promise) 
  * [Separate routes and services](#service) 
  * [Dependency injection](#di) 
  * [Object oriented programming (OOP)](#oop) 
  * [Compression & minification](#bundle) 
  * [0 disk access at runtime](#disk) 
  * [Bundle](#bundle) css, [sass](https://www.npmjs.com/package/node-sass)

## Routing

Our goal is to find the final route as fast as possible.
We use a tree data structure to represent all routes.

  * get(route, service, method)
  * post(route, service, method)
  * put(route, service, method)
  * delete(route, service, method)

```routes.json
{
    "services": [
        { "name": "$user", "location": "../services/info"}
    ],
    "locators": [
        { "get": "/user/:id", "service": "$user", "method": "get" },
        { "post": "/user", "service": "$user", "method": "save" }
    ]
}
```

```or server.js
qwebs.get("/user/:id", "$users", "get"); 
qwebs.post("/user", "$users", "save");
...
```

<a name="service"/>
## Define your service

```js
class ApplicationService {
    //$config service is automatically injected
    constructor($config) {
        if ($config.verbose) console.log("ApplicationService created.");
    };

    //send javascript object
    get(request, response) {
        let content = { message: "Hello World" };   
        return response.send({ request: request, content: content });
    };

    //send stream
    stream(request, response, reject) {
        let stream = fs.createReadStream('file.txt')
                       .on("error", reject)           //reject Promise
                       .pipe(new ToUpperCase())       //transform
                       .on("error", reject)           //reject Promise
        return response.send({ request: request, stream: stream });
    };
};

exports = module.exports = ApplicationService;
```

<a name="di"/>
## Dependency injection

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

<a name="response"/>
## Response

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

<a name="oop"/>
##### override response.send
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
        return new Promise((resolve, reject) => {
            if (data == undefined) reject(new DataError({ message: "No data." }));

            data.header = data.header || {};
            data.header["Cache-Control"] = "private";
            data.header["Expires"] = new Date(Date.now() + 3000).toUTCString();
            return super.send(response, data).then(resolve).catch(reject);
        });
    };
};

exports = module.exports = MyResponseService;
```

Replace $response service in $injector.

```routes.json
{
    "services": [
        { "name": "$response", "location": "../services/my-response"}
    ]
}
```

```or server.js
qwebs.inject("$response", "./services/myresponse");
```

<a name="disk"/>
## Avoid disk access at runtime

All assets are loaded in memory at startup.
Uploaded images are not saved in temporary files. $qjimp service is designed to read, manipulate image stream.

<a name="bundle"/>
## Bundle (bundle.json)

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
  
## Others Services
  
  * [$http](https://www.npmjs.com/package/qwebs-http)
  * [$https](https://www.npmjs.com/package/qwebs-https)
  * [$http-to-https](https://www.npmjs.com/package/qwebs-http-to-https)
  * [$mongo](https://www.npmjs.com/package/qwebs-mongo)
  * [$authentication](https://www.npmjs.com/package/qwebs-auth-jwt)
  * [$https](https://www.npmjs.com/package/qwebs-https)
  * [$nodemailer](https://www.npmjs.com/package/qwebs-nodemailer)
  * [$bitbucket](https://www.npmjs.com/package/qwebs-bitbucket-deploy)

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
