'use strict';
var hostUrl = '/website/templates/default/';

var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/:view', {
    templateUrl: function(rd) { return hostUrl+"/"+rd.view+'.html';}
  })
  .otherwise({ redirectTo: '/home' });
});
app.controller('enquiryController', function($scope,$http, $route, $location) {
	$scope.hostUrl = hostUrl;
	
	$http.get("/sitedata").success(function(response){
		if(response.status == "success"){
			$scope.config = response.config;
			$scope.hostUrl = response.config.http_template_path + response.webTemplate.template_folder+"/";
			$scope.business = response.webData.business;
			$scope.products = response.webData.products;
			$scope.services = response.webData.services;
			$scope.routes = response.webRoutes;
		}
	});
	
	$scope.postData = function(enquiry){
		$http.post("../server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
				console.log(response);
		});
	};

});