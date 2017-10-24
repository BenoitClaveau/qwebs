/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");
const EventEmitter = require('events');

//Event will created and linked with qwebs instance
class Event extends EventEmitter {
};

exports = module.exports = Event;
