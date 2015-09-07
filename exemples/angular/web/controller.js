var app = angular.module("app",[]);

app.controller("AppCtrl", [function() {
  this.collection = [];
  this.load = function() {
	  this.collection.push({name: "Paris"});
	  this.collection.push({name: "Lyon"});
  };
}]);