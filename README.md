# Qwebs
> Qwebs is a Web Server build with [Promises] (https://www.npmjs.com/package/q).
> 
> Qwebs is designed to be used with Single Page Application framework like Angular, React or Backbone.

## Features

  * [Promises] (https://www.npmjs.com/package/q)
  * Dependency injection
  * Http Routing
  * Optimize memory usage
  * Bundle
  * Css, Sass
  * Optimise response size
  * Html, css and javascript minification
  * No temporary image
  
### Promises

  * Easier to read
  * Easier to maintain in the future
  * Easier error handling

### Dependency injection

> Just declare the service name in your constructor.
> 
> Qwebs will create your service with its dependencies.

```js
Ex: function UserService($config) {
```

### Http Routing

Declare your routes

```js
qwebs.get("/user/:id", "$users", "get"); 
qwebs.post("/user", "$users", "save"); 
```

### Optimize memory usage

> All assets are loaded in memory at startup.
> 
> We do not want read during runtime.

### Bundle (bundle.json)

Create your own CSS, or JS bundles.

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

> Qwebs included a Sass preprocessor.
> 
> No need to compile your sass via an external program.

### Optimize response size

> Your response is automatically compressed in Gzip or Deflate.

### No temporary image

> Image is not saved in a temporary file.
> 
> We prefer data stream.

## Create your server

```js
var Qwebs = require('qwebs');

var qwebs = new Qwebs();
qwebs.inject("$app", "./applicationservice");
qwebs.get('/helloworld', "$app", "getHelloworld"); 

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

### API

  * get(route, service, method)
  * post(route, service, method)
  * put(route, service, method)
  * delete(route, service, method)
  * invoke(request, response)
  * invoke(request, response, overridenUrl)
  
### Services

  * $config
  * $qwebs
  * $injector
  * $qjimp
  * $repository 
  
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



  