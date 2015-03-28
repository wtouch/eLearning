
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies','upload'];

    // This is controller for this view
	var editprofileController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,upload) {
		
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		$scope.alerts = [];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		//datepicker {sonali}	
		$scope.today = function() 
		{
			$scope.dt = new Date();
		};
		$scope.today();
		$scope.open = function($event)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened =true;
		};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['yyyy/MM/dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		/* Date Picker Ended here */
		
		//function for match password
		$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
		}
		
		//dynamic dropdwnlist of country,state & city
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
		
		//code for change profile 
		dataService.get("getsingle/user/"+$rootScope.userDetails.id)
		.then(function(response) {
			$scope.editprofile = dataService.parse(response.data);
			$scope.getState($scope.editprofile.country);
			$scope.getCities($scope.editprofile.state);
			if($scope.editprofile.user_img == (undefined)) $scope.editprofile.user_img = "";
		});
		
		
		//Upload Function for uploading files {Vilas}
			// this is form object
		$scope.path = ""; // path to store images on server
		$scope.upload = function(files,path,userDetails,picArr){ // this function for uploading files
			
			upload.upload(files,'',userDetails,function(response){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(response.status === 'success'){
					$scope.editprofile.user_img = response.details;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		$scope.changeProfile = function(id,editprofile){
			dataService.put("put/user/"+id,editprofile)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.editProfileForm.$setPristine();
					$scope.alerts.push({type: response.status, msg: response.message});
					angular.extend($rootScope.userDetails,editprofile);
					dataService.setUserDetails($rootScope.userDetails);
					$rootScope.userDetails = dataService.parse(dataService.userDetails);
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			}) 
		}	
		
		//code for change password 
		$scope.changepassword = function(changepasswd) {
			
			$scope.userID = {user_id : $rootScope.userDetails.id };
			angular.extend(changepasswd, $scope.userID);
			dataService.post("post/user/changepass",changepasswd)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.changepasswd = {};
					$scope.changepassForm.$setPristine();
					$scope.alerts.push({type: response.status, msg: response.message});
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			})  
		}
    };
	// Inject controller's dependencies
	editprofileController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('editprofileController', editprofileController);
});
