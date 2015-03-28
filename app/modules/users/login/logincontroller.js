
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies', '$routeParams'];

    // This is controller for this view
	var loginController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,$routeParams) {
		
		($rootScope.alerts) ? $scope.alerts = $rootScope.alerts : $scope.alerts = [];

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		$scope.insert = function(login){
			dataService.post("post/user/login",$scope.login)
			.then(function(response) {
				if(response.status == 'success'){
					$location.path("/dashboard");
					dataService.setUserDetails(response.data);
					if($scope.login.remember){
						dataService.rememberPass(true);
					}
					dataService.setAuth(true);
					$rootScope.userDetails = dataService.userDetails;
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
					
				}
			})
		}
		
		$scope.forgotpass = function(forgot) {
			dataService.post("post/user/forgotpass",forgot)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.forgot = response.data;
					$location.path("/login");
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			})
		} 	
		
		$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
		}
		$scope.changepasswd = function(changepass) {
			var urlParams = {reset : $routeParams.resetPassKey}
			dataService.post("post/user/changepass",changepass,urlParams)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.changepass = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			})  
		}
		
		// Auto activate account
		if($routeParams.activateKey && $routeParams.email){
			$scope.activatePass = ($routeParams.pass) ? JSON.parse($routeParams.pass) : false;
			$scope.changePassword = function(changepass) {
				var urlParams = {activate : $routeParams.activateKey, email : $routeParams.email};
				if(changepass != (undefined || "")) angular.extend(urlParams, changepass);
				dataService.get("login/activate",urlParams)
				.then(function(response) {
					if(response.status == 'success'){
						$scope.changepass = {};
						$scope.alerts.push({type: response.status, msg: response.message});
						$scope.activate = true;
					}else{
						$scope.activate = false;
						$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
					}
				})  
			}
			if($scope.activatePass == false) $scope.changePassword();
			$scope.resendLink = function(){
				console.log($routeParams.email);
			}
		}

    };
	// Inject controller's dependencies
	loginController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('loginController', loginController);
});
