
'use strict';


define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies', '$routeParams'];

    // This is controller for this view
	var questionsController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,$routeParams) {
		$scope.alerts = [{type: "success", msg: "Record inserted successfully!"}];
		$scope.testViews = $routeParams.views;
		if($scope.testViews) $rootScope.breadcrumbs.breadcrumbs[$rootScope.breadcrumbs.breadcrumbs.length - 1].label = dataService.capitalize($scope.testViews);
		
		$scope.formPart = 'levels';
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		console.log("test controller");
		
	}
	// Inject controller's dependencies
	questionsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('questionsController', questionsController);
});
