'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService'];

    // This is controller for this view
	var websettingsController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService) {
	// all $scope object goes here
	$scope.userDetails = {user_id : $rootScope.userDetails.id};
	$scope.website_id=$routeParams.id;
	$scope.currentDate = dataService.currentDate;
	$scope.alerts = [];
	//this is for get business name from business
	dataService.get("getmultiple/business/1/100",$scope.userDetails)
			.then(function(response) {  //function for template list response
			//$scope.businessList.user_id=$scope.userDetails.user_id;
				if(response.status == 'success'){
					$scope.businessList = response.data;
					
				}else{
					
					$scope.alerts.push({type: response.status, msg: "You didn't added any business! Please add business first."});
				}
			});
			
			//this is for get business name from business{trupti}
			dataService.get("getmultiple/template/1/100",$scope.userDetails)
			.then(function(response) {  //function for template list response
			//$scope.templateList.user_id=$scope.userDetails.user_id;
				if(response.status == 'success'){
					$scope.templateList = response.data;
					
				}
				else{
					
					$scope.alerts.push({type: response.status, msg: "You didn't added any business! Please add business first."});
				}
			});
			
			//code for edit website details{trupti}
			$scope.userInfo = dataService.parse($rootScope.userDetails);
				dataService.get("getsingle/website/"+$routeParams.id,$scope.userDetails)
				.then(function(response) {  //function for my templates response
				if(response.status == 'success'){
					if(response.data.config!=''){
					var config = JSON.parse(response.data.config);
					$scope.config = config;
					console.log(config);
					}
					
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				//$scope.config = response.data;
			});
			//update method for website settings form{trupti}
			$scope.editWebsitedetails = function(config){
				dataService.put("put/website/"+$routeParams.id,{config : config})
				.then(function(response) {
					if(response.status == 'success'){
						$scope.alerts.push({type: response.status, msg: response.message});
					}else{
						$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
					}
				}) 
			}	
			
			/* //post data
			$scope.postData=function(config){
				dataService.put("put/website/"+$scope.website_id,{config : config})
				.then(function(response) { 
					if(response.status == 'success'){
						response.message
					}
					console.log(response.message);
				});
			};  */
		
    };
	//Inject controller's dependencies
	websettingsController.$inject = injectParams;
	//Register/apply controller dynamically
    app.register.controller('websettingsController', websettingsController);
});
