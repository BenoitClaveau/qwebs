// "use strict";

// class PromisePolyfill {
//     constructor() {

//         Promise.prototype.done = function (onFulfilled, onRejected) {
//             this.then(onFulfilled, onRejected)
//             .catch(function (reason) {
//                 setTimeout(() => { throw reason }, 0);
//             });
//         };

//         Promise.prototype.finally = function (callback) {
//             const P = this.constructor;
//             return this.then(
//                 value  => P.resolve(callback()).then(() => value),
//                 reason => P.resolve(callback()).then(() => { throw reason })
//             );
//         };
//     };
// };

// exports = module.exports = new PromisePolyfill();