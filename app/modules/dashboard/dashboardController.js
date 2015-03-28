'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var dashboardController = function ($scope, $injector) {
		$scope.goBack = function() 
		{
			window.history.back();
		};
	
    };
	
	// Inject controller's dependencies
	dashboardController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('dashboardController', dashboardController);
	
	
});
