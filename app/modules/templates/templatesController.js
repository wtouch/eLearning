'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','$location','$routeParams','dataService','upload','modalService'];
    
    // This is controller for this view
	var templatesController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService) {
		
		//console.log($rootScope.userDetails);
		//this code block for modal{trupti}
		$scope.open = function (url, tempId) {
			dataService.get("getsingle/template/"+tempId)
			.then(function(response) {
				//console.log(newObj);
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					tempList: dataService.parse(response.data)  // assign data to modal
				};

				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		//this model for show website details when click on apply button{trupti}
		$scope.showWebsitedetails = function (url, tempId) {
			$scope.status = {status:1};
			angular.extend($scope.status, $scope.userDetails);
			dataService.get("getmultiple/website/1/50",$scope.status)
			.then(function(response) {
				var oldObj = response.data;
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					websiteList: oldObj,  // assign data to modal
					tempId : {templates : {template_id : [tempId]}},
					updateConfig : function(formData){
						modalOptions.formData = formData;
					},
					
				};
				//console.log(dataService.parse($rootScope.userDetails));
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					var formData = modalOptions.formData;
					var userConfig = dataService.parse($rootScope.userDetails).config;
					var webConfig = dataService.parse(modalOptions.websiteList[formData.website_id].config);
					var userTemplateConfig = (userConfig.templates.template_id) ? userConfig.templates.template_id.push(tempId) : angular.extend(userConfig,formData.config);
					
					console.log(userTemplateConfig);
					console.log(userConfig);
					//angular.extend(userConfig, formData.config);
					angular.extend(webConfig, formData.config);
					dataService.put('put/website/'+formData.website_id, {config : webConfig})
					.then(function(response){
						console.log(response.message);
					});
					dataService.put('put/user/'+$rootScope.userDetails.id, {config : userConfig})
					.then(function(response){
						console.log(response.message);
					});  
					
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
	
		//for display form parts
		$scope.tempPart = $routeParams.tempPart;
		
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.currentDate = dataService.currentDate;
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		
		// All $scope methods
		$scope.pageChanged = function(page, where) { // Pagination page changed
			angular.extend(template_type, $scope.userDetails);
			dataService.get("getmultiple/template/"+page+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response){  //function for templatelist response
				$scope.templates = response.data;
				console.log($scope.templates);
			});
		};
	
		//for get the single col value from db{trupti} 
		$scope.changeScope = function(value, object){
			$scope.website.userDetails = value.id;
			//$scope.addproduct.business_id = value.id;
			$scope.changeScopeObject($scope.domain_name);
		}
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			console.log($scope.template_type);
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.template_type[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.template_type, $scope.filterStatus);
			dataService.get("getmultiple/template/1/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
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
			dataService.get("getmultiple/template/1/"+$scope.pageItems, $scope.webParam)
			.then(function(response) {  //function for websitelist response
			console.log(response);
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
			}
		}; 

		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		/*For display by default templatelist page {trupti}*/
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
		}
		
		//Upload Function for uploading files {Vilas}
		$scope.reqtemp={}; // this is form object
		$scope.addtemplate={};
		$scope.path = "template/"; // path to store images on server
		$scope.reqtemp.scrible  = {};// uploaded images will store in this array
		$scope.addtemplate.scrible  = {};
		
		$scope.upload = function(files,path,userDetails,picArr){ //this function for uploading files

			upload.upload(files,path,userDetails,function(data){
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
		
		
		$scope.temp = {};
		$scope.temp = dataService.config.template;
		
		//for post add template data{trupti}
		$scope.postData=function(addtemplate){
			console.log(addtemplate);
		}
		// switch functions
		var mytemplates = function(){
			dataService.get("getmultiple/template/"+$scope.myTempCurrentPage+"/"+$scope.pageItems, $scope.userDetails)
			.then(function(response) {  //function for my templates response
			if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				$scope.templates = response.data;
			});
		};
	
		//list of templates
		var listoftemplates = function(){
			$scope.template_type = {template_type : 'public', status:1};
			angular.extend($scope.template_type, $scope.userDetails);
			dataService.get("getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
					if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});//end of by default templist
			
			//function for active button
			var showActive= function(status){
				$scope.template_type = {template_type : 'public',status:1};
				dataService.get("getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
						if(response.status == 'success'){
						$scope.templates=response.data;
						$scope.totalRecords = response.totalRecords;
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
					};
				});
			//end of active button function
			}
		
			//This code for apply/buy button{trupti}
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			$scope.apply = function(id, applied){
				$scope.appliedData = {applied : applied};
				
				dataService.put("put/template/"+id, $scope.appliedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
		};
		
		var custometemplates = function(){
			$scope.template_type = {template_type : 'private',status:1,custom:1};
			angular.extend($scope.template_type, $scope.userDetails);
			dataService.get("getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for template list response
				if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};

			});
			
			//function for active button
			var showActive= function(status){
				$scope.template_type = {template_type : 'private',status:1,custom:1};
				dataService.get("getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
						if(response.status == 'success'){
						$scope.templates=response.data;
						$scope.totalRecords = response.totalRecords;
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
					};
				});
			//end of active button function
			}
			
			//This code for apply/buy button{trupti}
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			//This code for active/delete button 
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				console.log($scope.featuredData);
				dataService.put("put/template/"+id, $scope.featuredData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			};
			
			//This code for reject/order_placed button 
			$scope.reject = function(id, development_status){
				$scope.featuredData = {development_status : development_status};
				console.log($scope.featuredData);
				dataService.put("put/template/"+id, $scope.featuredData)
				.then(function(response) { 
					console.log(response);
				});
			};
		
			$scope.apply = function(id, applied){
				$scope.appliedData = {applied : applied};
				dataService.put("put/template/"+id, $scope.appliedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
		}
		
		var requestcustomtemplates = function(){
			//reset function{trupti}
			$scope.reset = function() {
				$scope.reqtemp = {};
			};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(reqtemp) { 
			//$scope.reqtemp = {};
			//$scope.requestcustomtempForm.$setPristine();
			$scope.reqtemp.user_id= $rootScope.userDetails.id;
			$scope.reqtemp.date = $scope.currentDate;
				 dataService.post("post/template",reqtemp)
				.then(function(response) {  //function for response of request temp
					$scope.reqtemp = response.data;
					console.log(response);
					$scope.reset();
					console.log(reqtemp);
				});
			}//end of post method{trupti}
		}
	
		//post method for add template form(trupti)
		var addtemplate = function(){
			//reset function{trupti}
			$scope.reset = function() {
				$scope.addtemplate = {};
			};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(addtemplate) { 
			//$scope.addtemplate = {};
			//$scope.submittempForm.$setPristine();
			$scope.userDetails=$scope.userDetails;
			$scope.addtemplate.date = $scope.currentDate;
				dataService.post("post/template",addtemplate,$scope.userDetails)
				.then(function(response) {  //function for response of request temp
					$scope.addtemplate = response.data;
					console.log(response);
					$scope.reset();
					console.log(addtemplate);
				});
			}//end of post method{trupti}
		}
		
		switch($scope.tempPart) {
			case 'listoftemplates':
				listoftemplates();
				break;
			case 'mytemplates':
				mytemplates();
				break;
			case 'custometemplates':
				custometemplates();
				break;
			case 'requestcustomtemplates':
				requestcustomtemplates();
				break;	
			default:
				listoftemplates();
		};
    };
	
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
});
