'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','modalService'];

    // This is controller for this view
	var businessController = function ($scope,$rootScope,$injector, $routeParams,$location,dataService,modalService)
	{
		
		console.log(dataService.config);
		//This code for modal {sonali}
		$scope.open = function (url, buzId) {
			dataService.get("getsingle/business/"+buzId)
			.then(function(response) {
				
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					bizList: dataService.parse(response.data)  // assign data to modal
				};
				console.log(dataService.parse(response.data));
				
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};

		
		
		//all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.bizListCurrentPage = 1;
		$scope.delBizCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		if($rootScope.userDetails.group_name == "customer"){
			$scope.userInfo = {user_id : $rootScope.userDetails.id}; // these are URL parameters
		}
		if($rootScope.userDetails.group_name == "manager"){
			$scope.userInfo = {manager_id : $rootScope.userDetails.id}; // these are URL parameters
		}
		if($rootScope.userDetails.group_name == "admin"){
			$scope.userInfo = {}; // these are URL parameters
		}
		if($rootScope.userDetails.group_name == "salesman"){
			$scope.userInfo = {salesman_id : $rootScope.userDetails.id}; // these are URL parameters
		}
		
		$scope.hideDeleted = "";
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		// This will change businessView dynamically from 'business.html' {Vilas}
		
		$scope.businessView = $routeParams.businessView;
		
		//for display default businesslist.html{sonali}
		if(!$routeParams.businessView) {
			$location.path('/dashboard/business/businesslist');
		}	
		
		$scope.pageChanged = function(page, featured) {
			(featured) ? angular.extend($scope.businessParams, featured) : "";
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems, $scope.businessParams)
			.then(function(response) { //function for businesslist response			
				$scope.bizList = response.data;			
			});
		};
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, colValue) {
			$scope.filterStatus= {};
			(colValue =="") ? delete $scope.businessParams[statusCol] : $scope.filterStatus[statusCol] = colValue;
			angular.extend($scope.businessParams, $scope.filterStatus);
			dataService.get("/getmultiple/business/1/"+$scope.pageItems, $scope.businessParams)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.bizList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.bizList = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
			});
		};
			
		
		$scope.searchFilter = function(statusCol, colValue) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			(colValue =="") ? delete $scope.businessParams[statusCol] : $scope.filterStatus[statusCol] = colValue;
			angular.extend($scope.businessParams, $scope.filterStatus, $scope.search);
			
			if(colValue.length >= 4 || colValue ==""){
				dataService.get("/getmultiple/business/1/"+$scope.pageItems, $scope.businessParams)
				.then(function(response) {  //function for templatelist response
					if(response.status == 'success'){
						$scope.bizList = response.data;
						$scope.totalRecords = response.totalRecords;
					}else{
						$scope.bizList = {};
						$scope.totalRecords = {};
						$scope.alerts.push({type: response.status, msg: response.message});
					}
					//console.log($scope.properties);
				});
			}
		};
		
		var businesslist = function(){
			$scope.businessParams = {status: 1};
			angular.extend($scope.businessParams, $scope.userInfo);
			dataService.get("/getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems, $scope.businessParams)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.bizList=response.data;
					$scope.totalRecords=response.totalRecords;									
				}
				else{
					$scope.bizList = {};
					$scope.totalRecords = {};	
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});	
			
			//Update business edit button {sonali}
			$scope.editBusiness = function(id){
				$location.path('/dashboard/business/addbusiness/'+id);
			};
			
			//This code for verify button {sonali}
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				
				dataService.put("put/business/"+id, $scope.veryfiedData)
				.then(function(response) { //function for businesslist response
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			} ;
			//This code for featured unfeatured button {sonali}
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				console.log($scope.featuredData);
				dataService.put("put/business/"+id, $scope.featuredData)
				.then(function(response) { //function for businesslist response
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};

			//delete button {sonali}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				//console.log($scope.deletedData);
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						$scope.hideDeleted = 1;
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};			
		};
		
		var deletedbusiness = function(){
			$scope.businessParams = {status: 0};
			angular.extend($scope.businessParams, $scope.userInfo);
			dataService.get("/getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems, $scope.businessParams)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.bizList = response.data;
					$scope.totalRecords=response.totalRecords;									
				}
				else{
					$scope.bizList = {};
					$scope.totalRecords = {};	
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				//console.log($scope.deletedData);
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						$scope.hideDeleted = 0;
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};

		};
		
		
		switch($scope.businessView) {
			case 'businesslist':
			console.log("businesslist");
				businesslist();
				break;
			case 'deletedbusiness':
			console.log("deletedbusiness");
				deletedbusiness();
				break;
			default:
				businesslist();
		};
		
    };
	
	// Inject controller's dependencies
	businessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('businessController', businessController);

});
