/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");

class JsParser {

    static getConstructorArguments(source) {
		const constructor = source.match(/constructor\s?\([\s\S]*?\)/); //search constructor
		if (!constructor) return [];
		const tokens = constructor[0].match(/^[^\(]*\(\s*([^\)]*)\)/m); //parse constructor arguments
		return tokens[1].replace(/ /g, '').split(',');
    }
    
}

exports = module.exports = JsParser;