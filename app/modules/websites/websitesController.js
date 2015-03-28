'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService'];

    // This is controller for this view
	var websitesController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService) {
        //for display form parts
        $scope.websitePart = $routeParams.websitePart;
        //open function for previewing the website[Dnyaneshwar].
        $scope.open = function (url, webId) {
			dataService.get("getsingle/website/"+webId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					website: response.data  // assign data to modal
				};
				console.log(response.data);
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				}); 
				
			});
		};
		
        // all $scope object goes here
        $scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.webListCurrentPage = 1;
		$scope.reqestSiteCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.currentDate = dataService.currentDate;
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		
		// All $scope methods
        $scope.pageChanged = function(page,where) { // Pagination page changed
			angular.extend($scope.domain_name, $scope.userDetails);
			dataService.get("getmultiple/website/"+page+"/"+$scope.pageItems, $scope.domain_name)
			.then(function(response) {  //function for websitelist response
				$scope.website = response.data;
				console.log($scope.website);
			});
		};
		
		//for search filter{trupti}
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			$scope.webParam={};
			(showStatus =="") ? delete $scope.webParam[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.webParam, $scope.filterStatus);
			angular.extend($scope.webParam, $scope.search);
			if(showStatus.length >= 4 || showStatus == ""){
			dataService.get("getmultiple/website/1/"+$scope.pageItems, $scope.webParam)
			.then(function(response) {  //function for websitelist response
			console.log(response);
				if(response.status == 'success'){
					$scope.website = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.website = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
			}
		}; 
			
		$scope.changeStatus={};
		$scope.editDomainName = function(colName, colValue, id, editStatus){
			$scope.changeStatus[colName] = colValue;
			console.log(colValue);
			console.log($scope.changeStatus);
				if(editStatus==0){
				 dataService.put("put/website/"+id,$scope.changeStatus)
				.then(function(response) { 
					//if(status=='success'){
						//$scope.hideDeleted = 1;
					//}
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	 
		
		$scope.showInput = function($event,opened) 		
		{
			$scope.domain_name = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		//this is global method for filter 
		$scope.changeStatusFn = function(statusCol, showStatus) {
			console.log($scope.status);
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.status[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.status, $scope.filterStatus);
			dataService.get("getmultiple/website/1/"+$scope.pageItems, $scope.status)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.website = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.website = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: "No data Found"});
				}
			});
		};  
	
        //function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
        /*For display by default websitelist.html page*/
		if(!$scope.websitePart) {
			$location.path('/dashboard/websites/websiteslist');
		}
		
		//for tooltip
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
        
        // switch functions
        var requestnewsite = function(){
			$scope.reqnewsite = {};
			//post method for insert data in request site form{trupti}
			$scope.postData = function(reqnewsite) { 
			//$scope.reqnewsite = {};
			//$scope.requestsiteForm.$setPristine();
			console.log(reqnewsite);
			$scope.userDetails=$scope.userDetails;
			$scope.reqnewsite.user_id= $rootScope.userDetails.id;
			$scope.reqnewsite.date = $scope.currentDate;
				 dataService.post("post/website",reqnewsite)
				//dataService.post("post/website",reqnewsite,$scope.userDetails)
				.then(function(response) {  //function for response of request site
					$scope.reqnewsite = response.data;
					console.log(response);
					console.log(reqnewsite);
				});   
			}//end of post method{trupti} 
		};
        
        var websiteslist = function(){
			//function for websiteslist{Dnyaneshwar}
			$scope.domain_name = {status: 1}
			angular.extend($scope.domain_name, $scope.userDetails);
			dataService.get("getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.domain_name)
			.then(function(response) {  //function for websiteslist response
			if(response.status == 'success'){
					$scope.website=response.data;
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});
			//delete button {trupti}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/website/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						//$scope.hideDeleted = 1;
						//console.log(response);
						$scope.website=response.data;
					}
				});
			};			
		};
		
		//function for active button
		var showActive= function(status){
		$scope.status = {status:1};
			dataService.get("getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.status)
				.then(function(response) {  //function for templatelist response
					if(response.status == 'success'){
						$scope.website=response.data;
						$scope.totalRecords = response.totalRecords;
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
					};
				});
			
		}//end of active button function
        
        var requestedsitelist = function(){
			//function for requestedsitelist{Dnyaneshwar}
			dataService.get("getmultiple/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems, $scope.userDetails)
			.then(function(response) {  //function for requestedsitelist response
			if(response.status == 'success'){
					$scope.website=response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				$scope.website = response.data;
			});
		};
        
        switch($scope.websitePart) {
			case 'websiteslist':
				websiteslist();
				break;
			case 'requestnewsite':
				requestnewsite();
				break;
			case 'requestedsitelist':
				requestedsitelist();
				break;
			default:
				websiteslist();
		};
	
    };
	// Inject controller's dependencies
	websitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websitesController', websitesController);
});
