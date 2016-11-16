/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */

"use strict";

function InfoService() {
}

InfoService.prototype.whoiam = function() {
	return "I'm Info service.";
};

InfoService.prototype.getInfo = function(request, response) {
	return {
		whoiam: this.whoiam()
	};
};

exports = module.exports = InfoService;