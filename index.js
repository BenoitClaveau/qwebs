/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

'use strict';

module.exports = require('./lib/qwebs');
module.exports.DataError = require('./lib/dataerror');
module.exports.createWritableBuffer = require('./lib/utils/stream/createwritablebuffer');
module.exports.mergeStream = require('./lib/utils/stream/mergestream');
