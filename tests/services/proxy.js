/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

var Proxy = require('../../lib/services/proxy');

class ProxyService extends Proxy {
	constructor($config) {
		super($config)	
	};
	
	forward(request, response) {
		let result = super.forward(request, response);
		this.$config.proxy.hosts = []; //remove proxy for testing
		return result;
	};
};


exports = module.exports = ProxyService;