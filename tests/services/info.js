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

	getInfo(request, response, promise) {
		return promise.then(function(self) {
			return {
				whoiam: self.whoiam()
			};
		});
	};

	getMessage(request, response, promise) {
		return promise.then(function(self) {
			return {
				text: "hello world"
			};
		});
	};
};

exports = module.exports = InfoService;