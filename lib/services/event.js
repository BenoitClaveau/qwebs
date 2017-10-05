/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const DataError = require("./../dataerror");
const EventEmitter = require('events');

class Event extends EventEmitter {
};

exports = module.exports = Event;
