/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");
const AnnotationBuilder = require('../annotations/builder.js');
const parser = require('../annotations/parser.js');

class JsParser {

    static getConstructorArguments(source) {
        try {
			let constructor = source.match(/constructor\s?\([\s\S]*?\)/); //search constructor
			if (constructor) {
				let tokens = constructor[0].match(/^[^\(]*\(\s*([^\)]*)\)/m); //parse constructor arguments
				return tokens[1].replace(/ /g, '').split(',');
			}
			else {
				return [];
			}
		}
		catch(error) {
			throw new Error("No constructor found.", { source: source }, error);
		}
	}

	static getAnnotations(source) {
		const comments = parser.parse(source);
		return new AnnotationBuilder(comments);
	}
}

exports = module.exports = JsParser;