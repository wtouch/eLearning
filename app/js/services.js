'use strict';

// Services goes here

define(['app'], function (app) {
	var app =  angular.module('customServices', []);
	app.service('modalService', ['$modal', function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
			size : 'md',
            templateUrl: '../app/modules/component/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);
	/******************************************************************************
	 * Modal Service Ends Here */
	
	app.factory('breadcrumbs', [
      '$rootScope',
      '$location',
      '$route',
      function ($rootScope, $location, $route) {
        var BreadcrumbService = {
          breadcrumbs: [],
          get: function(options) {
            this.options = options || this.options;
            if (this.options) {
              for (var key in this.options) {
                if (this.options.hasOwnProperty(key)) {
                  for (var index in this.breadcrumbs) {
                    if (this.breadcrumbs.hasOwnProperty(index)) {
                      var breadcrumb = this.breadcrumbs[index];
                      if (breadcrumb.label === key) {
                        breadcrumb.label = this.options[key];
                      }
                    }
                  }
                }
              }
            }
            return this.breadcrumbs;
          },
          generateBreadcrumbs: function() {
            var routes = $route.routes,
                _this = this,
                params,
                pathElements,
                pathObj = {},
                path = '',
                originalPath = '',
                param;

            if ($route && $route.current && $route.current.originalPath) {
              this.breadcrumbs = [];
              params = $route.current.params;
              pathElements = $route.current.originalPath.trim().split('/');

              // Necessary to get rid of of duplicate empty string on root path
              if (pathElements[1] === '') {
                pathElements.splice(1, 1);
              }

              angular.forEach(pathElements, function(pathElement, index) {
                param = pathElement[0] === ':' &&
                        typeof params[pathElement
                          .slice(1, pathElement.length)] !== 'undefined' ?
                        params[pathElement.slice(1, pathElement.length)] :
                        false;

                pathObj[index] = {
                  path: param || pathElement,
                  originalPath: pathElement
                };

                path = Object
                  .keys(pathObj)
                  .map(function(k) { return pathObj[k].path;  })
                  .join('/') || '/';

                originalPath = Object
                  .keys(pathObj)
                  .map(function(k) { return pathObj[k].originalPath;  })
                  .join('/') || '/';

                if (routes[originalPath] &&
                    (routes[originalPath].label || param) &&
                    !routes[originalPath].excludeBreadcrumb) {
                  _this.breadcrumbs.push({
                    path: path,
                    originalPath: originalPath,
                    label: routes[originalPath].label || param,
                    param: param
                  });
                }
              });
            }
          }
        };

        // We want to update breadcrumbs only when a route is actually changed
        // as $location.path() will get updated immediately (even if route
        // change fails!)
        $rootScope.$on('$routeChangeSuccess', function() {
          BreadcrumbService.generateBreadcrumbs();
        });

        $rootScope.$watch(
          function() { return BreadcrumbService.options; },
          function() {
            BreadcrumbService.generateBreadcrumbs();
          }
        );

        BreadcrumbService.generateBreadcrumbs();

        return BreadcrumbService;
      }
    ]);
	
	/* File Upload Service 
	**********************************************************************/
	app.factory('upload', [
      '$rootScope',
	  
      '$upload',
	  '$timeout',
      function ($rootScope, $upload, $timeout) {
		return {
			fileReaderSupported : window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false),
			upload : function (files,path,userinfo,success,error) {
				if (files && files.length) {
					var progressArr = {};
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						$upload.upload({
							url: '../server-api/index.php/upload',
							fields: {'path': path, 'userinfo': userinfo},
							file: file
						}).progress(function (evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							//console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
							file.progress = progressPercentage;
							
						}).success(function (data, status, headers, config) {
							//console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
							success(data, status, headers, config);
						}).error(function(err,err1,err2, err3){
							error(err,err1,err2,err3);
							//console.log(err3);
						});
					}
				}
			},
			generateThumb : function(file) {
				if (file != null) {
					if (this.fileReaderSupported && file.type.indexOf('image') > -1) {
						$timeout(function() {
							var fileReader = new FileReader();
							fileReader.readAsDataURL(file);
							fileReader.onload = function(e) {
								$timeout(function() {
									file.dataUrl = e.target.result;
								});
							}
						});
					}
				}
			},
			generateThumbs : function(files) {
				if (files && files.length) {
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						this.generateThumb(file);
					}
				}
			}
		}
	  }]);
	  
	  /* $HTTP Service for server request
	  *************************************************************************/
	  
	  app.factory("dataService", ['$http', '$window','$rootScope', '$cookieStore', '$cookies',
		function ($http, $window,$rootScope,$cookieStore,$cookies) { // This service connects to our REST API

			var serviceBase = '../server-api/index.php/';
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var date = today.getDate();
			var hour = today.getHours();
			var min = today.getMinutes();
			var sec = today.getSeconds();
			var obj = {};
			obj.currentDate = year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec;
			obj.setBase = function(path){
				serviceBase = path;
			};
			obj.stringify = function(oldObj){
				var newObj = {};
				angular.forEach(oldObj, function(value, key) {
				  this[key] = JSON.stringify(value);
				}, newObj);
				return newObj;
			}
			// this parse will parse within array or object of JSON string to object/array
			obj.parse = function(oldObj){
				if(angular.isArray(oldObj)){
					var newObj = [];
					for(var x in oldObj){
						var newArrObj = {};
						angular.forEach(oldObj[x], function(value, key) {
						  this[key] = (angular.isObject(value)) ? value :(value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? JSON.parse(value) : value;
						}, newArrObj);
						newObj.push(newArrObj);
					}
				}else{
					var newObj = {};
					angular.forEach(oldObj, function(value, key) {
					  this[key] = (angular.isObject(value)) ? value :(value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? JSON.parse(value) : value;
					}, newObj);
				}
				return newObj;
			}
			obj.config = (sessionStorage.config) ? JSON.parse(sessionStorage.config) : null ;
				$http.get('js/config.json').success(function(response){
					sessionStorage.config =  JSON.stringify(response);
					obj.config = response;
				});

			
			obj.rememberPass = function(remb){
				$cookieStore.put('auth',remb);
			}
			obj.logout = function(){
				obj.get('/login/logout').then(function(response){
					$rootScope.LogoutMsg = response;
					obj.userDetails = null;
					obj.setAuth(false);
					obj.removeCookies($cookies);
					sessionStorage.clear();
				});
			};
			obj.removeCookies = function(cookies){
				angular.forEach(cookies, function (v, k) {
					$cookieStore.remove(k);
				});
			}
				
			obj.auth = ($cookieStore.get('auth')) ? true : (sessionStorage.auth) ? JSON.parse(sessionStorage.auth) : false;
			//obj.userDetails = (sessionStorage.userDetails) ? JSON.parse(sessionStorage.userDetails) : null;
			obj.userDetails = ($cookieStore.get('userDetails')) ? (angular.isObject($cookieStore.get('userDetails'))) ? $cookieStore.get('userDetails') : JSON.parse($cookieStore.get('userDetails')) : null;
			
			obj.setAuth = function (data) {
				sessionStorage.auth = data;
				//$cookieStore.put('userDetails',data);
				return obj.auth =  JSON.parse(sessionStorage.auth);
			};
			obj.setUserDetails = function(data){
				if(data == (undefined || "")){
					console.log("data undefined: "+data);
				}else{
					//sessionStorage.userDetails = (data);
					$cookieStore.remove('userDetails');
					$cookieStore.put('userDetails',data);
					//obj.userDetails = JSON.parse(sessionStorage.userDetails);
					obj.userDetails = (angular.isObject($cookieStore.get('userDetails'))) ? $cookieStore.get('userDetails') : JSON.parse($cookieStore.get('userDetails'));
				}
			}
			obj.get = function (q, params) {
				return $http({
					url: serviceBase + q,
					method: "GET",
					params: params
				}).then(function (results) {
					return results.data;
					
				});
			};
			obj.post = function (q, object, params) {
				return $http({
					url: serviceBase + q,
					method: "POST",
					data: object,
					params: params
				}).then(function (results) {
					return results.data;
				});
			};
			obj.put = function (q, object, params) {
				return $http({
					url: serviceBase + q,
					method: "PUT",
					data: object,
					params: params
				}).then(function (results) {
					return results.data;
				});
			};
			obj.delete = function (q, object, params) {
				return $http({
					url: serviceBase + q,
					method: "DELETE",
					data: object,
					params: params
				}).then(function (results) {
					return results.data;
				});
			};

			return obj;
	}]);

	return app;
});