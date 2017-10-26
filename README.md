# Qwebs

 async/await application framework with dependency-injection.

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]
 [![NPM Download][npm-image-download]][npm-url]
 [![Dependencies Status][david-dm-image]][david-dm-url]

```shell
npm install $qwebs --save
```

 Discover our [starter kit](https://www.npmjs.com/package/qwebs-starter-kit-polymer) with [Polymer](https://www.polymer-project.org/).

# Features

  * [Promise & async/await](#async/await) 
  * [Single config file](#config) 
  * [Dependency injection](#di) 
  * [Object oriented programming (OOP)](#oop) 
  * [Separate services](#service) 
  * [Compression & minification](#bundle) 
  * [0 disk access at runtime](#disk) 
  * [Bundle](#bundle) css, [sass](https://www.npmjs.com/package/node-sass)
  * [Configuration](#config)
  
<a name="async/await"/>
## Promise & async/await

  * Easier to read
  * Easier to maintain in the future
  * Easier error handling

## Services
<a name="service"/>

Develop your own service in a separate file. Your don't need to instanciate it. Qwebs [DI](#di) do that job. If you use another service just inject it in your constructor.

> What is the main avantage to use DI ?
>
> You could easily override any service. Unit testing will be easy.

```qwebs.json
{
    "services": [
        { "name": "$http", "location": "qwebs-http"},
        { "name": "$service", "location": "./service"}
    ]
}
```

<a name="config"/>
## Create config.json

Qwebs embed a configuration manager. 

<a name="di"/>
## Dependency injection

Just declare the service name in your constructor.
Injected services are created as singleton.

```services/user.js
class UserService {
    constructor($config)
```

Qwebs will create your service with its dependencies.

```routes.json
{
    "services": [
        { "name": "$user", "location": "../services/user"}
        ...
```

## Services

  * $config: your configuration.
  * $qwebs: qwebs instance.
  * $injector: resolve services at runtime.
  * $qjimp: convert and manipulate images.
  
## Others Services
  
  * [$http](https://www.npmjs.com/package/qwebs-http)
  * [$mongo](https://www.npmjs.com/package/qwebs-mongo)
  * [$authentication](https://www.npmjs.com/package/qwebs-auth-jwt)
  * [$nodemailer](https://www.npmjs.com/package/qwebs-nodemailer)
  * [$bitbucket](https://www.npmjs.com/package/qwebs-bitbucket-deploy)
  * [$aws-s3](https://www.npmjs.com/package/qwebs-aws-s3)
  * [$aws-ses](https://www.npmjs.com/package/qwebs-aws-ses)
  * [aws api gateway](https://www.npmjs.com/package/qwebs-aws-api-gateway)


## Test

To run our tests, clone the Qwebs repo and install the dependencies.

```bash
$ git clone https://github.com/BenoitClaveau/qwebs --depth 1
$ cd qwebs
$ npm install
$ cd tests
$ node.exe "../node_modules/mocha/bin/mocha" .
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
