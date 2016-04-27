/*!
 * qwebs service
 */
"use strict";

class ApplicationService {
    constructor() {
    };

    getHelloWorld(request, response) {
        let content = { message: "Hello World" };
        return response.send({ request: request, content: content });
    };
};

exports = module.exports = ApplicationService;