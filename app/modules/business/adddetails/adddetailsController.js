'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','upload','modalService', '$rootScope'];

    // This is controller for this view
	var adddetailsController = function ($scope, $injector,$routeParams,$location,dataService,upload,modalService, $rootScope)
	{
		dataService.get("getsingle/business/"+$routeParams.id)
		.then(function(response) {
			$scope.businessData = dataService.parse(response.data);
			if($scope.businessData.infrastructure == "") $scope.businessData.infrastructure = {};
			if($scope.businessData.testimonials == "") $scope.businessData.testimonials = {};
			if($scope.businessData.news_coverage == "") $scope.businessData.news_coverage = {};
			if($scope.businessData.gallery == "") $scope.businessData.gallery = {};
			if($scope.businessData.job_careers == "") $scope.businessData.job_careers = {};
		});	
		
		
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.business_id = $routeParams.id;
		$scope.userinfo = $scope.userInfo; // this is for uploading credentials
		$scope.path = "business/"; // path to store images on server
		$scope.infrastructure = { desc : { image  : {} }};
		$scope.testimonials = { desc : { image  : {} }};
		$scope.news_coverage = { desc : { image  : {} }};
		$scope.job_careers = { desc : { image  : {} }};
		$scope.gallery = { desc : { image  : {} }};
		// config data for business form
		$scope.biz = dataService.config.business;
		
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'infrastructure';
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		$scope.infra = false;
		$scope.imgRemoved = false;
		// Scope methods
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
			$scope.headingDisabled = false;
			$scope.infra = false;
			$scope.imgRemoved = false;
		};
		
		
		$scope.addToObject = function(data, object, resetObj){
			var dtlObj = JSON.stringify(data.desc);
			object[data.heading] = JSON.parse(dtlObj);
			$scope.headingDisabled = false;
			$scope.infra = false;
			$scope.imgRemoved = false;
			//console.log(data);
			$scope[resetObj] = { desc : { image  : {} }};
			console.log(data);
		}
		
		$scope.removeObject = function(key, object){
			$scope.imgRemoved = true;
			delete object[key];
		}
		$scope.editObject = function(key, object, FormObj){
			$scope.headingDisabled = true;
			$scope.imgRemoved = true;
			var dtlObj = JSON.stringify(object[key]);
			FormObj['desc'] = JSON.parse(dtlObj);
			FormObj['heading'] = key;
		}
		
		$scope.showForm = function(obj, resetObj){
			$scope[obj] = !$scope[obj];
			if(resetObj){
				$scope.headingDisabled = false;
				$scope.imgRemoved = true;
				$scope[resetObj] = { desc : { image  : {} }};
			}
		}
		
		/**********************************************************************
		code for accessing json data of country, State & City {Sonali}*/
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
		
		/*************************************************************************
		Upload Function for uploading files {sonali}*/
		$scope.upload = function(files,path,userinfo, picArr){ // this function for uploading files
			
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.details;
					console.log(data.message);
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
				
			}); 
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
			
		/***********************************************************************************
		Update business form code here{sonali}*/
		$scope.update = function(businessData){				
			console.log(businessData);						
			dataService.put("put/business/"+ $scope.business_id, businessData)  // use business id here
			 .then(function(response) {  //function for response of request temp
				if(response.status == 'success'){
					$scope.submitted = true;
					$scope.alerts.push({type: response.status,msg: response.message});						
				}else{
					$scope.alerts.push({type: response.status,msg: response.message});
				}
			});
		};
    };
	
	// Inject controller's dependencies
	adddetailsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('adddetailsController', adddetailsController);

});
