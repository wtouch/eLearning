'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope','$rootScope', '$injector', '$routeParams','$location','dataService','$route']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope,$rootScope, $injector, $routeParams,$location,dataService,$route) {
		//variable decalaration
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.usersGroupCurrentPage = 1;
		$scope.usersListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.userList = [];
		$scope.alerts = [];
		$scope.currentDate = dataService.currentDate;
		$scope.userInfo = {user_id : $rootScope.userDetails};
		$scope.contries = dataService.config.country;

		$scope.getState = function(country){
			var states = [];
			for (var x in $scope.contries){
				if($scope.contries[x].country_name == country){
					for(var y in $scope.contries[x].states){
						states.push($scope.contries[x].states[y])
					}
				}
			}
			$scope.states = states;
		};
		$scope.getCities = function(state){
			var cities = [];
			for (var x in $scope.states){
				if($scope.states[x].state_name == state){
					for(var y in $scope.states[x].cities){
						cities.push($scope.states[x].cities[y])
					}
				}
			}
			$scope.cities = cities;
		};
		
		// for dynamic value of group name
		dataService.get('getmultiple/usergroup/1/200').then(function(response){
			
			if(response.status=='success'){
				$scope.groups = response.data;
			}else{
				$scope.alerts.push({type: response.status, msg: response.message});
			}
		}) ;
		$scope.changeGroupName = function(group_id, groups){
			var group_name;
			for(var x in groups){
				if(groups[x].id == group_id) group_name = groups[x].group_name;
			}
			
			return group_name;
			console.log(group_name);
		}
		
		$scope.disableGroup = function(group_name){
			if(group_name == ("admin" || "manager") && $rootScope.userDetails.group_name != "admin"){
				return true;
			}
		}
		$scope.disColors = function(color){
		  return color.group_name == 'admin' || color.group_name == 'manager';
		}
		//dynamic checkboxes in create user group form
		$scope.manage_user = dataService.config.manage_user;
		
		//For display by default userslist.html page
		$scope.userViews = $routeParams.userViews; 
		if(!$routeParams.userViews) {
			$location.path('/dashboard/users/userslist');
		}
		
		//change tooltip dynamically
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		//datepicker {sonali}	
		$scope.today = function() 
		{
			$scope.date = new Date();
		};
		$scope.today();
		$scope.open = function($event,opened)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = ($scope.opened==true)?false:true;
		};
		$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		// Date Picker Ended here 
		
		//code for pagination
		$scope.pageChanged = function(page) {
			if($scope.userViews == 'userslist'){
				dataService.get("getmultiple/user/"+page+"/"+$scope.pageItems).then(function(response){
					$scope.userList = response.data;
					$scope.totalRecords = response.totalRecords;
				});
			}
			if($scope.userViews == 'usersgroup'){
				dataService.get("getmultiple/usergroup/"+page+"/"+$scope.pageItems).then(function(response){
					$scope.usergroupList = response.data;
					$scope.totalRecords = response.totalRecords;
				});
			}
			
		};	
		//End of pagination
		
		
		
		//code for search filter
		$scope.searchFilter = function(statusCol, colValue) {
			$scope.search = {search: true};
			$scope.userParams = {};
			$scope.filterStatus= {}; // search filter for send request ex. {columnName : value}
			(colValue =="") ? delete $scope.userParams[statusCol] : $scope.filterStatus[statusCol] = colValue;
			angular.extend($scope.userParams, $scope.filterStatus);
			angular.extend($scope.userParams, $scope.search);
			if(colValue.length >= 4 || colValue ==""){
				if($scope.userViews == 'userslist'){
					dataService.get("/getmultiple/user/1/"+$scope.pageItems, $scope.userParams).then(function(response) { 
						if(response.status == 'success'){
							$scope.userList = response.data; // this will change for template
							$scope.totalRecords = response.totalRecords; // this is for pagination
						}else{
							$scope.userList = {};
							$scope.totalRecords = {};
							$scope.alerts.push({type: response.status, msg: response.message});
						}
					});
				}
				if($scope.userViews == 'usersgroup'){
					dataService.get("/getmultiple/usergroup/1/"+$scope.pageItems, $scope.userParams).then(function(response) { 
						if(response.status == 'success'){
							$scope.usergroupList = response.data; // this will change for template
							$scope.totalRecords = response.totalRecords; // this is for pagination
						}else{
							$scope.usergroupList = {};
							$scope.totalRecords = {};
							$scope.alerts.push({type: response.status, msg: response.message});
						}
					});
				}
			}
		};
		
		//global method for change status of particular column 
		$scope.hideDeleted = "";// & use this filter in ng-repeat - filter: { status : hideDeleted}
		$scope.changeStatus = {};
		$scope.changeStatusFn = function(colName, colValue, id){
			$scope.changeStatus[colName] = colValue;
			if($scope.userViews=='userslist'){
				dataService.put("put/user/"+id, $scope.changeStatus)
				.then(function(response) {
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			}
			if($scope.userViews=='usersgroup'){
				dataService.put("put/usergroup/"+id, $scope.changeStatus)
				.then(function(response) { 
					$scope.alerts.push({type: response.status, msg: response.message});
				}); 
			}
			
		};
		
		$scope.editGroupName = function(colName, colValue, id, editStatus){
			$scope.changeStatus[colName] = colValue;
			if(editStatus==0){
				 dataService.put("put/user/"+id,$scope.changeStatus)
				.then(function(response) { 
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	
		$scope.showDropDown = function($event,opened)		
		{
			$scope.user_groups = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		$scope.forgotPass = function(colName, colValue, id){
			$scope.changeStatus[colName] = colValue;				
				 dataService.post("post/user/forgotpass", $scope.changeStatus)
				.then(function(response) {					
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
		};
		
		$scope.adduser ={};
		//add user information
		var addUsers =	function(){
			
			//check availability
		$scope.checkuserAvailable = function(fieldName, fieldValue){
			
			$scope.checkParams = {};
			$scope.checkParams[fieldName] = fieldValue;
			dataService.post("post/user/checkavailability",$scope.checkParams)
			.then(function(response) { 
				if(response.status == 'success'){
					if(fieldName == 'username') $scope.UserAvailable = true;
					if(fieldName == 'email') $scope.EmailAvailable = true;
					//$scope.adduserForm[fieldName].$setValidity('available', true);
				}else{
					if(fieldName == 'username') $scope.UserAvailable = false;
					if(fieldName == 'email') $scope.EmailAvailable = false;
					//$scope.adduserForm[fieldName].$setValidity('available', false);
				}
				$scope.availabilityMsg = response.message;
			});
		}
		
			$scope.reset = function() {
				$scope.adduser = {};
			};
			$scope.postData = function(adduser) {
				var register_date = {register_date : $scope.currentDate};
				angular.extend(adduser, register_date);
				
				dataService.post("post/user/register",adduser)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.adduser = {};
						//$scope.adduserForm.$setPristine();
						$scope.submitted = true;
						$scope.alerts.push({type: response.status, msg: response.message});
						
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
				});
			}
			$scope.editUserId = $routeParams.id;
			if($routeParams.id){
				
				dataService.get("getsingle/user/"+$routeParams.id)
				.then(function(response) {
					$scope.adduser = response.data;
				});
				$scope.update = function(adduser){
					dataService.put("put/user/"+$routeParams.id,adduser)
					.then(function(response) {
						if(response.status == 'success'){
							$scope.submitted = true;
							$scope.alerts.push({type: response.status, msg: response.message});
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
						}
					});
				};
			}
		};			
		
		
		//create user group
		var usersGroup = function(){
			$scope.usersgroupData = {
				group_permission : {
					user_module : {},
					group_access : {},
					template_module : {},
					business_module : {},
					website_module : {}
				},
				config:{}
			};
			$scope.editForm = false;
			$scope.reset = function() {
				$scope.usersgroup = angular.copy($scope.usersgroupData);
			};
			$scope.reset();
			$scope.usersgroup.date = $scope.currentDate;
				$scope.postData = function(usersgroup) {
					dataService.post("post/usergroup",usersgroup)
					.then(function(response) {  
						if(response.status == 'success'){
							$scope.alerts.push({type: response.status, msg: response.message});
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
						}	
						$scope.reset();
					});
				
			}

			if($routeParams.id){
				$scope.editForm = true;
				dataService.get("getsingle/usergroup/"+$routeParams.id)
				.then(function(response) {
					$scope.usersgroup = dataService.parse(response.data);
					if($scope.usersgroup.config == (undefined || "")) $scope.usersgroup.config = {};
				});
				$scope.update = function(usersgroup){
					dataService.put("put/usergroup/"+$routeParams.id,usersgroup)
					.then(function(response) {
						if(response.status == 'success'){
							$scope.alerts.push({type: response.status, msg: response.message});
						
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
						}
					});
				};
			}
		}	
		
		var usersList = function(){
			dataService.get("getmultiple/user/"+$scope.usersListCurrentPage+"/"+$scope.pageItems).then(function(response) {
				if(response.status == 'success'){
					$scope.userList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		var usersgroupList = function(){
			dataService.get("getmultiple/usergroup/"+$scope.usersGroupCurrentPage+"/"+$scope.pageItems).then(function(response) { 
				//console.log(response);
				if(response.status == 'success'){
					$scope.usergroupList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		switch($scope.userViews) {
			case 'adduser':
				addUsers();
				break;
				
			case 'createusergroup':
				usersGroup();
				break;
				
			case 'userslist':
				usersList();
				break;
				
			case 'usersgroup':
				usersgroupList();
				break;
				
			default:
				usersList();
		};
	};
	// Inject controller's dependencies
	manageuserController.$inject = injectParams;
	// adduser/apply controller dynamically
    app.register.controller('manageuserController', manageuserController);
});