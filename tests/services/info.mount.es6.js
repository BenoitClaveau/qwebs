/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

class InfoService {
	constructor() {
		this.mounted = false; 
	};

	async mount() {
		return new Promise((resolve, reject) => {
			setTimeout(resolve, 1000);
		}).then(() => {
			this.mounted = true;
		});
	}
	
	whoiam() {
		return this.mounted ? "I'm Info service." : "I'n not mounted";
	};

	helloworld() {
		return this.mounted ? "Hello world." : "I'n not mounted";
	};
};

exports = module.exports = InfoService;