function InfoService () {
};

InfoService.prototype.whoiam = function() {
	return "I'm Info service.";
};

InfoService.prototype.getInfo = function(request, response, promise) {
	return promise.then(function(self) {
		return {
			whoiam: self.whoiam()
		};
	});
};

InfoService.prototype.getMessage = function(request, response, promise) {
	return promise.then(function(self) {
		return {
			text: "hello world"
		};
	});
};

exports = module.exports = InfoService;