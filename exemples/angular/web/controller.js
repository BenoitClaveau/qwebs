var app = angular.module("app",[]);

app.controller("AppCtrl", ["$http", function($http) {
  this.collection = [];
  this.city = {name: ""};
  
  this.load = function() {
    var self = this;
	  $http.get("/cities").then(function(res) {
      self.collection = res.data;
    });
  };
  
  this.add = function() {
    var self = this;
	  $http.post("/city", self.city).then(function() {
      self.load();
    });
  };
  
}]);