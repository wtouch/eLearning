
'use strict';


define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies', '$routeParams'];

    // This is controller for this view
	var testsController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,$routeParams) {
		$scope.testViews = $routeParams.views;
		if($scope.testViews) $rootScope.breadcrumbs.breadcrumbs[$rootScope.breadcrumbs.breadcrumbs.length - 1].label = dataService.capitalize($scope.testViews);
		
		
		console.log("test controller");
		
	}
	// Inject controller's dependencies
	testsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('testsController', testsController);
});
