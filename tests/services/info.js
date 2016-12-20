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
	
	save(request, response) {
		return {
			status: "saved"
		};
	};
	
	update(request, response) {
		return {
			status: "updated"
		};
	};
	
	delete(request, response) {
		return {
			status: "deleted"
		};
	};
};

exports = module.exports = InfoService;