
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var forgotpassController = function ($scope,$injector) {
		console.log("this is forgot ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/forgotpass/forgotpass.html';
    };
	// Inject controller's dependencies
	forgotpassController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('forgotpassController', forgotpassController);
});
