/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { Writable } = require('stream');
const { Readable } = require('stream');

class InfoService {
	constructor() {	
	};
	
	whoiam() {
		return "I'm Info service.";
	};

	helloworld() {
		return "Hello world.";
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

	getStream(request, response) {
		const stream = Readable({objectMode: true}); 
		stream._read = () => {};                     
		stream.push({ id: 1 });
    	stream.push({ id: 2 });
        stream.push(null);

		return response.send({ request: request, stream: stream });
	};

	getStreamWithTimeout(request, response) {
		const stream = Readable({objectMode: true}); 
		stream._read = () => {};                     

		setTimeout(() => {
			stream.push({ id: 1 });
			stream.push({ id: 2 });
			stream.push(null);
		}, 1000);
		
		return response.send({ request: request, stream: stream });
	};

	getStreamWithString(request, response) {
		const stream = Readable({objectMode: true}); 
		stream._read = () => {};                     
		stream.push("{ id: 1 }");
    	stream.push("{ id: 2 }");
        stream.push(null);

		return response.send({ request: request, stream: stream });
	};

	getStreamMultipleTypes(request, response) {
		const stream = Readable({objectMode: true}); 
		stream._read = () => {};                     
		stream.push("{ id: 1 }");
    	stream.push({ id: 2, name: "myname" });
		stream.push(33);
        stream.push(null);

		return response.send({ request: request, stream: stream });
	};

	getStreamError(request, response) {
		const stream = Readable({objectMode: true}); 
		stream._read = () => {};                     
		stream.push({ id: 1 });
		stream.emit("error", new Error("Error in stream."));
    	stream.push({ id: 2 });
        stream.push(null);

		return response.send({ request: request, stream: stream });
	};

	getStreamErrorAfterSending(request, response) {
		const stream = Readable({objectMode: true}); 
		stream._read = () => {};                     
		
		setTimeout(() => {
			stream.push({ id: 1 });
			setTimeout(() => {
				stream.push({ id: 2 });
				setTimeout(() => {
					stream.emit("error", new Error("Error in stream."));
					//stream.push(null);
				}, 500);
			}, 500);
		}, 100)

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