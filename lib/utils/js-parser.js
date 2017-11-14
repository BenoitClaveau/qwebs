/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error } = require("oups");
const IGNORE = [
    'abstract', 'access', 'alias', 'augments', 'author', 'borrows',
    'callback', 'classdesc', 'constant', 'constructor', 'constructs',
    'copyright', 'default', 'deprecated', 'desc', 'enum', 'event',
    'example', 'exports', 'external', 'file', 'fires', 'global',
    'ignore', 'inner', 'instance', 'kind', 'lends', 'license',
    'link', 'member', 'memberof', 'method', 'mixes', 'mixin',
    'module', 'name', 'namespace', 'param', 'private', 'property',
    'protected', 'public', 'readonly', 'requires', 'returns', 'see',
    'since', 'static', 'summary', 'this', 'throws', 'todo', 'tutorial',
    'type', 'typedef', 'variation', 'version'
];

class JsParser {

    static getConstructorArguments(source) {
		const constructor = source.match(/constructor\s?\([\s\S]*?\)/); //search constructor
		if (!constructor) return [];
		const tokens = constructor[0].match(/^[^\(]*\(\s*([^\)]*)\)/m); //parse constructor arguments
		return tokens[1].replace(/ /g, '').split(',');
	}

	static getAnnotations(source) {
        const comments = this.extractComments(source)
        const annotations = this.parseComments(comments);
        return this.reduce(annotations);
    }

	static extractComments(source) {
        let matches = [];
        let match;
        const regex = /\*([^\*]|[\s]|(\*+([^\*`\/]|[\s])))*\*+/g;

		while(match = regex.exec(source)) {
            const lines = match[0].split("\n").map(line => {
                return line.replace(/(^\s+)|\r/g, "").replace(/(^(\*)+|)/g, "");
            }).reduce((previous, current) => {
                if (!current) return previous;
                current = current.trim();
                if (/^@\w/.test(current)) previous.push(current);
                return previous;
            }, []);

            
        }

        return matches;
    }

    static parseComments(comments) {
        let annotations = [];

        for (let comment of comments) {
            const match = /^@(\w)/.exec(comment);
            if (match) {
                const name = match[2];
            }
        }

        return annotations;
    }

    static reduce(annotations) {
        return annotations.reduce((previous, current) => {
            if (IGNORE.some(e => e == current.key)) return previous;

            switch(current.key) {
                case 'Class': 
                    previous.class[current.value] = [];
                    break;
                case 'Method':
                    previous.methods[current.value] = [];
                    break;
                case 'Property':
                    previous.properties[current.value] = [];
                    break;
            }
            return previous;
        }, {
            "class": [],
            "methods": {},
            "properties": {}
        })
    }
}

exports = module.exports = JsParser;