'use strict';
/* Controllers */
angular.module('realEstate.controllers',[]).
controller('responseCtrl', function($scope,$http, $routeParams, $location) {
	if(!$routeParams.type && !$routeParams.status){
		$location.path( "/response/web/all" );
	}
	$scope.type = $routeParams.type;
	$scope.status = $routeParams.status;
	$scope.id = $routeParams.id;
	console.log($scope.status);
	$scope.getClass = function(path) {
    if ($location.path().substr(0, path.length) == path) {return "active"} else {return ""}}
	
	//this request for all response data
	$http.get("server-api/index.php/response")
	.success(function(response) {$scope.resopnses = response;});
	
	//this request for single response data
	if($routeParams.id) {
		$http.get("server-api/index.php/response/"+$routeParams.id)
		.success(function(response) {$scope.resopnses = response;});
	}
}).
controller('projectCtrl', function($scope, $http, $routeParams) {
	$scope.projects = { title: "vilas title"};
	//this request for single response data
	if($routeParams.type) {
		$http.get("server-api/index.php/project/"+$routeParams.type)
		.success(function(response) {$scope.projects = response;
			console.log($scope.projects);
		});
		
	}else{
		//this request for all response data
		$http.get("server-api/index.php/project")
		.success(function(response) {$scope.projects = response;
			console.log($scope.projects);
		});
		
	}
	
	//Add Project
	$scope.reset = function() {
	$scope.projects = {};
		};
		$scope.addproject = function(){
			console.log($scope.projects);
			$http.post("server-api/index.php/addproject", $scope.projects)
			.success(function(response) {
				alert(response);
				$scope.reset();
				
			});
		};
	
	
	//Update Project
	
	$http.get("server-api/index.php/editproject/"+$routeParams.id)
    .success(function(response) {
		$scope.projects = response;
		$scope.reset = function() {
			$scope.projects = angular.copy($scope.projects);
		};
		$scope.reset();
		console.log($scope.projects);
		
	}).error(function(err){
		console.log(err);
	});
	
	$scope.update = function(){
		$http.put("server-api/index.php/editproject/"+$routeParams.id,$scope.projects)
		.success(function(response) {
			alert(response);
		});
	};
		
}).
controller('propertyCtrl', function($scope, $http, $routeParams) {

	//this request for single response data
	if($routeParams.type) {
		$http.get("server-api/index.php/property/"+$routeParams.type)
		.success(function(response) {$scope.properties = response;
			console.log($scope.properties);
		});
		
	}else{
		//this request for all response data
		$http.get("server-api/index.php/property")
		.success(function(response) {$scope.properties = response;
			console.log($scope.properties);
		});
		
		// Add property
		$scope.reset = function() {
			$scope.properties = {};
		};
		$scope.addprop = function(){
			console.log($scope.properties);
			$http.post("server-api/index.php/addproperty", $scope.properties)
			.success(function(response) {
				alert(response);
				$scope.reset();
			});
		};
	}
	if($routeParams.id){
		//Update Property
		$http.get("server-api/index.php/editproperty/"+$routeParams.id)
		.success(function(response) {
			$scope.properties = response;
			$scope.reset = function() {
				$scope.properties = angular.copy($scope.properties);
			};
			$scope.reset();
			console.log($scope.properties);
			
		}).error(function(err){
			console.log(err);
		});
		
		$scope.update = function(){
			$http.put("server-api/index.php/editproperty/"+$routeParams.id,$scope.properties)
			.success(function(response) {
				alert(response);
			});
		}
	}
}).

controller('registerCtrl', function($scope,$http,$routeParams) {
	//Add record
	
	$scope.reset = function() {
	$scope.reg = {};
	};
	$scope.insert = function(){
		//console.log($scope.user);
		$http.post("server-api/index.php/register",$scope.reg)
		.success(function(response) {
			alert(response);
			$scope.reset();
		})
	}

	
	//update record
	$http.get("server-api/index.php/editprofile/"+$routeParams.id)
    .success(function(response) {
		$scope.editpro = response;
		$scope.reset = function() {
			$scope.editpro = angular.copy($scope.editpro);
		};
		$scope.reset();
		console.log($scope.editpro);
		
	}).error(function(err){
		console.log(err);
	});
	
	$scope.update = function(){
	$http.put("server-api/index.php/editprofile/"+$routeParams.id,$scope.editpro)
		.success(function(response) {
			alert(response);
		})
	}
});
/*.
controller('loginCtrl', function($scope,$http) {
		//Add data
	$scope.update = function(){
		console.log($scope.login);
		$http.post("server-api/index.php/login/", $scope.login)
		.success(function(response) {
			alert(response);
			//$scope.reset();
		})
	}
	//Get data
	$http.get("server-api/index.php/login")
		.success(function(response) {$scope.properties = response;
			console.log($scope.properties);
		});
	
});
*/






	




	


