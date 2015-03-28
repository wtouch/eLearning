'use strict';
var app = angular.module('myApp', []);
app.controller('enquiryController', function($scope,$http) {
   $scope.postData = function(enquiry){
	   $http.post("../server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
				console.log(response);
			});
   };
		
});