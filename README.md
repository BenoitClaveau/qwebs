# qwebs
Qwebs is a web server designed to be used with single page application framework

```js
var qwebs = require('qwebs'),
    helloService = require('./services/helloservice');

qwebs.init({
  config: {
    debug: true
  },
  bundles: {
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

qwebs.get('/').register(helloService, "getHello");
qwebs.post('/').register(helloService, "postHello");

http.createServer(function (request, response) {
    return qwebs.invoke(request, response);
}).listen(3000);
```

## Features

  * Routing
  * Fully integrates promises
  * No template engine
  * Assets are loaded into memory
  * OOP
  * Html, css and javascript minification
  
## Installation

```bash
$ npm install qwebs
```
  