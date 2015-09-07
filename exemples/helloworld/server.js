/*!
 * qwebs server
 */
"use strict";

var qwebs = require('../../lib/qwebs'),
    applicationService = require('./applicationservice'),
    http = require('http'),
    Q = require('q'),
    request = require('request');

qwebs.init();

qwebs.get('/helloworld').register(applicationService, "getHelloworld"); 

http.createServer(function (request, response) {
    return qwebs.invoke(request, response);
}).listen(1337, "127.0.0.1");
// 
// console.log('Server running at http://127.0.0.1:1337/');
// 
// 
// request("http://127.0.0.1:1337/helloworld", function (error, response, body) {
//   console.log(body) // Show the HTML for the Google homepage. 
// });
// 
// Q.ninvoke(request, 'get', ).then(function(response, body) {
//     console.log(response.statusCode) // 200 
//     console.log(response.headers['content-type']) // 'image/png' 
//     
//     console.log("body", body);
// }).catch(function(error){
//     console.log(error);
// });