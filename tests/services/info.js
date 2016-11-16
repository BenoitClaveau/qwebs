/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const Readable = require('stream').Readable;

class MyReadable extends Readable {
  constructor() {
    super({ objectMode: true });
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
		console.log("getMessage readeable created");
		setTimeout(() => {
		  console.log("push hello world");
		  source.push({ text: "hello world" });
		  console.log("push null")
		  source.push(null);
		}, 1000);
		console.log("response.send with stream");
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
