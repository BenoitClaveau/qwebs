/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

var JSONStream = require('JSONStream');
const Writable = require('stream').Writable;
const Readable = require('stream').Readable;

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

	getStreamNotReadable(request, response) {
		let stream = new Readable();

		stream.on('data', function(data) {
			console.log("[DEBUG]", data)
		});

		stream.push('[{ "id": "1"}, { "id": "2"}]');

		//stream.push({ id: 2});
		stream.push(null);

		return response.send({ request: request, stream: stream });
	};

	getStream(request, response) {
		var stream = new MyReadable();

		return response.send({ request: request, stream: stream });
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

class MyReadable extends Readable {
  constructor(options) {
    super(options);
  }
}

exports = module.exports = InfoService;