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

exports = module.exports = InfoService;