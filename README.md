# Qwebs
> Qwebs is a Web Server build with [Promises](https://www.npmjs.com/package/q).
> Qwebs is designed to be used with Single Page Application framework like Angular, React or Backbone.

## Features

  * [Promises](https://www.npmjs.com/package/q)
  * Dependency injection
  * Http routing
  * Response
  * Optimize memory usage
  * Bundle
  * Css, Sass
  * Html, css and javascript minification
  * No temporary image
  
### Promises

  * Easier to read
  * Easier to maintain in the future
  * Easier error handling

### Dependency injection

> Just declare the service name in your constructor.
> Qwebs will create your service with its dependencies.

```js
Ex: function UserService($config) {
```

### Http routing

> Our goal is to find the final route as fast as possible.
> We use a tree data structure to represent all routes.

#### API

  * get(route, service, method)
  * post(route, service, method)
  * put(route, service, method)
  * delete(route, service, method)

```js
qwebs.get("/user/:id", "$users", "get"); 
qwebs.post("/user", "$users", "save");
```

### Response

> Your response is automatically compressed with Gzip or Deflate.

#### API

  * response.send(data)
  
    > request: Node request object
    
    > [statusCode](http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1)
    
    > [header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.2) 
    
    > content: Json, Html

  * qwebs.invoke(request, response, overridenUrl)
  
    > Usefull to route to an asset 

### Optimize memory usage

> All assets are loaded in memory at startup because we do not want read file during runtime.

### Bundle (bundle.json)

Create your own CSS or JS bundle.

 * JS
 * CSS, SCSS

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

### Css, Sass

> We included a Sass preprocessor.
> You don't need to compile your sass via an external program.

### No temporary image

> When an image is uploaded we do not saved it in temporary files. We prefer use data stream.

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

### API

  * inject(service, location)
  
    > Inject your service, define a service name and the location of your package.
    
  * load()
  
    > Resolve all services.
    
  * invoke(request, response)
  
    > Delegate the response to Qwebs.

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

  * $config
  
    > You can access your configuration.
    
  * $qwebs
  
    > Retrieve your qwebs instance.
    
  * $injector
  
    > Use injector service to resolve services at runtime.
    
  * $qjimp
  
    > Convert and manipulate uploaded images.
    
  * $repository
  
    > Load and retrieve files store in a folder.
  
## Installation

```bash
$ npm install qwebs
```

## Examples

> To run our examples, clone the Qwebs repo and install the dependencies.

```bash
$ git clone https://github.com/beny78/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd exemples/helloworld
$ node server.js
```

## Test

> To run our tests, clone the Qwebs repo and install the dependencies.

```bash
$ git clone https://github.com/beny78/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd tests
$ node.exe "..\node_modules\jasmine-node\bin\jasmine-node" --verbose .
```