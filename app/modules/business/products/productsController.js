'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams','dataService','upload','modalService'];

    // This is controller for this view
	var productsController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService) {
		//console.log("Product Controller"); // Just Added for testing {Vilas}
		
		//for display form parts of product & service
		$scope.productView = $routeParams.productView;
	
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.addproductCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		//$scope.tinymceConfig = {};
		//$scope.selectBusiness = {};
		
		//Upload Function for uploading files {Vilas}
		$scope.addproduct={}; // this is form object
		$scope.addservice = {};
		$scope.userinfo = {user_id:1}; // this is for uploading credentials
		
		$scope.path = "product/"; // path to store images on server
		$scope.addproduct.product_image  = {}; // uploaded images will store in this array
		$scope.addservice.product_image  = {}; // uploaded images will store in this array
		$scope.upload = function(files,path,userinfo,picArr){//this function for uploading files
		console.log(picArr);
	
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.details;
					console.log(data.message);
				}else{
					$scope.alerts.push({type: data.status, msg: d.message});
				}
	
			});
		};
		
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		$scope.changeScope = function(value, object){
			$scope.addservice.business_id = value.id;
			$scope.addproduct.business_id = value.id;
			$scope.changeScopeObject($scope.productType);
		}
		$scope.showProductForm = false;
		$scope.showServiceForm = false;
		$scope.showForm = function(object){
			console.log(object);
			$scope[object] = ($scope[object]==true) ? false : true;
			$scope.$apply;
			if(object == 'showProductForm'){
				addproducts();
			}
			if(object == 'showServiceForm'){
				addservices();
			}
			
			if(value=="service"){
				console.log("service if");
				servicelist();
			} 
		}
		// get data for business options 
		
		//for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		dataService.get("getmultiple/business/1/100",$scope.userDetails)
			.then(function(response) {  //function for template list response
			//$scope.businessList.user_id=$scope.userDetails.user_id;
				if(response.status == 'success'){
					$scope.businessList = response.data;
					//console.log($scope.businessList);
				}else{
					
					$scope.alerts.push({type: response.status, msg: "You didn't added any business! Please add business first."});
				}
				$scope.businessList = response.data;
				//console.log(businessList);
			});
		//end of options
		var addproducts = function(){ 
			//reset function{trupti}
				console.log($scope.addproduct.business_id);
				$scope.reset = function(){
				$scope.addproduct = {};
			};
			//angular.extend(addproduct,$scope.userDetails);
			$scope.postData = function(addproduct) { 
			//$scope.addproducts = {};
			//$scope.addproductForm.$setPristine();
			$scope.addproduct.user_id= $rootScope.userDetails.id;
			$scope.addproduct.date = $scope.currentDate;
				 dataService.post("post/product",addproduct)
				.then(function(response) {  //function for response of request temp
					$scope.addproduct = response.data;
					console.log(response.message);
					$scope.reset();
				}); 
				console.log(addproduct);
			}//end of post method {trupti}  
			console.log("add product");
		}
		
		var addservices = function(){
			//reset function{trupti}
			console.log($scope.addservice.business_id);
			$scope.reset = function() {
				$scope.addservice = {};
			};
		    $scope.addservice.user_id= $rootScope.userDetails.id;
			$scope.postData = function(addservice) { 
			//$scope.addservice = {};
			//$scope.addserviceForm.$setPristine();
			console.log(addservice);
			$scope.userDetails=$scope.userDetails;
			$scope.addservice.date = $scope.currentDate;
				dataService.post("post/product",addservice)
				.then(function(response) {  //function for response of request temp
					$scope.addservice = response.data;
					console.log(response);
					$scope.reset();
				});
				console.log(addservice);
			} //end of post method {trupti} 
		}
	
		//view for product list
		var productlist= function(){
				$scope.productFilter = {business_id : $scope.selectBusiness.id, type : 'product'};
				angular.extend($scope.userDetails, $scope.productFilter);
				dataService.get("getmultiple/product/1/10",$scope.userDetails)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.products = [];
						var x;
						for (x in response.data){
							var oldObj = response.data[x];
							var newObj = {};
							var arrConvrt = function(arr){
								//console.log(arr);
								var newArr = [];
								var x;
								for(x in arr){
									newArr.push(JSON.parse(arr[x]));
								}
								return newArr;
							}
							angular.forEach(oldObj, function(value, key) {
							  this[key] = (value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? 
										((angular.isArray(JSON.parse(value))) ? arrConvrt(JSON.parse(value)) : JSON.parse(value)) : value;
							  //(key === 'infrastructure') ? JSON.parse(value) : value;
							}, newObj);
							$scope.products.push(newObj);
						}
						console.log($scope.products);
						console.log(response.data);
						//$scope.totalRecords = response.totalRecords;	
							//for read only
					 /*  if($scope.products == response){
							$scope.tinymceConfig = {
								readonly: true,
								//toolbar: false,
								//menubar: false,
								//statusbar: false
							  }
						}   */
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
						$scope.products = {};
					};
				});
				
			}	

		var servicelist= function(){
			$scope.productFilter = {business_id : $scope.selectBusiness.id, type : 'service'};
				angular.extend($scope.userDetails, $scope.productFilter);
				dataService.get("getmultiple/product/1/10",$scope.userDetails)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.services = response.data;
						console.log(response);
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
						$scope.services = {};
					};
				});
		}
		
		$scope.productType = "product";
		$scope.changeScopeObject = function(value){
			$scope.productType = value;
			console.log($scope.showProductForm);
			if(value=="product" && $scope.showProductForm == true){
				addproducts();
			}
			
			if(value=="product"){
				productlist();
				console.log("product if");
			}
			
			if(value=="service" && $scope.showServiceForm == true){
				addservices();
			}
			
			if(value=="service"){
				servicelist();
				console.log("service if");
			}
		}
	
    };
	// Inject controller's dependencies
	productsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('productsController', productsController);
	
});
