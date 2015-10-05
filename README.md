# Qwebs
Qwebs is a Web Server build with Promises.
Qwebs is designed to be used with Single Page Application framework like Angular, React or Backbone.

## Features

  * Promises
  * Injector
  * Http Routing
  * Optimize memory usage
  * Bundle
  * Css, Sass
  * Optimise response size
  * Html, css and javascript minification
  * No temporary image
  
### Promises

Your code will be easyier to read and maintain in the future.

### Injector

Easier access to Qwebs services.
Just declare the service name in your constructor.

```js
Ex: function UserService($config) {
```

### Http Routing

Declare your routes

```js
qwebs.get('/user/:id', "$users", "get"); 
qwebs.post('/user', "$users", "save"); 
```

### Optimize memory usage

All assets are loaded in memory at startup.
No files are read during runtime.

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

Qwebs included a Sass preprocessor.
No need to compile your sass via an external program.

### Optimize response size

Your response size is automatically compressed in Gzip or Deflate.

### No temporary image

Image is not saved in a temporary file.
We do not want that Qwebs accesses the disk.
We prefer use stream.

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



  