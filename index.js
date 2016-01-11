/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

'use strict';

module.exports = require('./lib/qwebs');
module.exports.DataError = require('./lib/dataerror');
module.exports.ReadableBufferStream = require('./lib/utils/stream/readablebufferstream');
module.exports.WritableBufferStream = require('./lib/utils/stream/writablebufferstream');
module.exports.MergeStream = require('./lib/utils/stream/mergestream');