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
		let content = {
			whoiam: this.whoiam()
		};
		return response.send({ request: request, content: content });
	};

	getMessage(request, response) {
		let content = {
			text: "hello world"
		};
		return response.send({ request: request, content: content });
	};
	
	save(request, response) {
		let content = {
			status: "saved"
		};
		return response.send({ request: request, content: content });
	};
	
	update(request, response) {
		let content = {
			status: "updated"
		};
		return response.send({ request: request, content: content });
	};
	
	delete(request, response) {
		let content = {
			status: "deleted"
		};
		return response.send({ request: request, content: content });
	};
};

exports = module.exports = InfoService;
