/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const Readable = require('stream').Readable;

class MyReadable extends Readable {
  constructor(options) {
    super(options);
  }

  _read() {};
}

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
		let source = new MyReadable();
		setTimeout(() => {
		  source.push(JSON.stringify({ text: "hello world" }));
		  source.push(null);
		}, 1000);
		return response.send({ request: request, stream: source }); //use stream instead of content		
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

        redirect(request, response) {
                return response.redirect({ url: "get" });
        }
};

exports = module.exports = InfoService;
