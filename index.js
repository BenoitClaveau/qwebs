/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

'use strict';

module.exports = require('./lib/qwebs');
module.exports.Singleton = require('./lib/singleton');
module.exports.WebError = require('./lib/weberror');
module.exports.Repository = require('./lib/utils/repository');
module.exports.MergeStream = require('./lib/stream/mergestream');
module.exports.ToArray = require('./lib/stream/toarray');
module.exports.ToBuffer = require('./lib/stream/tobuffer');
module.exports.walk = require('./lib/utils/walk');
module.exports.QJimp = require('./lib/services/qjimp');
module.exports.Client = require('./lib/services/client');
