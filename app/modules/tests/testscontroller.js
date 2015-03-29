
'use strict';


define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies', '$routeParams'];

    // This is controller for this view
	var testsController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,$routeParams) {
		
		$scope.alerts = [{type: "success", msg: "Record inserted successfully!"}];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		$scope.testViews = $routeParams.views;
		if($scope.testViews) $rootScope.breadcrumbs.breadcrumbs[$rootScope.breadcrumbs.breadcrumbs.length - 1].label = dataService.capitalize($scope.testViews);
		
		
		
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		$scope.testConfig = dataService.config.tests;
		
		$scope.addToObject = function(data, object, resetObj, id){
			data[id] = object.length + 1;
			var dtlObj = JSON.stringify(data);
			if(angular.isArray(object)) object.push(JSON.parse(dtlObj));
		}
		
		$scope.removeObject = function(key, object){
			delete object[key];
		}
		$scope.editObject = function(key, object, FormObj){
			var dtlObj = JSON.stringify(object[key]);
			FormObj['desc'] = JSON.parse(dtlObj);
			FormObj['heading'] = key;
		}
		
		$scope.showForm = function(obj){
			$scope[obj] = !$scope[obj];
		}
		$scope.consoleThis = function(data){
			console.log(data);
		}
		
		var questions = function(){
			$scope.formPart = 'addquestion';
			console.log($scope.formPart);
		}
		var questiongroups = function(){
			$scope.formPart = 'levels';
			
		}
		var testgroups = function(){
			$scope.formPart = 'addtestgroup';
			$scope.testgroup = {group_config:{}};
			$scope.testgroups = {};
		}
		var tests = function(){
			$scope.formPart = 'tests';
			
		}
		var createtest = function(){
			$scope.formPart = 'createtest';
			
		}
		
		switch($scope.testViews) {
			case 'questions':
				questions();
				break;
			case 'questiongroups':
				questiongroups();
				break;
			case 'testgroups':
				testgroups();
				break;
			case 'tests':
				tests();
				break;
			case 'createtest':
				createtest();
				break;
			default:
				questions();
		}
		
	}
	// Inject controller's dependencies
	testsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('testsController', testsController);
});
