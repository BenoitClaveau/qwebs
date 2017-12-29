/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

'use strict';

module.exports = require('./lib/qwebs');
module.exports.Json = require('./lib/services/json');
module.exports.MergeStream = require('./lib/stream/mergestream');
module.exports.ToArray = require('./lib/stream/toarray');
module.exports.FromArray = require('./lib/stream/fromarray');
module.exports.ToBuffer = require('./lib/stream/tobuffer');