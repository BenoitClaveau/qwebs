/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

class StringUtils {
	
    static dashToCamelCase(text) {
    	return text.toLowerCase().replace(/-(.)/g, (match, group1) => {
        	return group1.toUpperCase();
    	});
	}

	static camelCaseToDash(text) {
    	return text.replace( /([a-z|0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}
}

exports = module.exports = StringUtils;