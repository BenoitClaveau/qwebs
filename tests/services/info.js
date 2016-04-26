/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */

"use strict";

class InfoService {
	constructor() {	
	};
	
	whoiam() {
		return "I'm Info service.";
	};

	getInfo(request, response) {
		return {
			whoiam: this.whoiam()
		};
	};

	getMessage(request, response) {
		return {
			text: "hello world"
		};
	};
};

exports = module.exports = InfoService;