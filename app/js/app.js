'use strict'; 

define(['angular',
	'angularRoute',
	'ngCookies',
	'ngSanitize',
	'routeResolver',
	'bootstrap',
	'directives',
	'services', 
	'filters',
	'upload','uploadShim',
	'css!../css/bootstrap.min','css!../css/style'
], function(angular, angularRoute, ngCookies) {
	// Declare app level module which depends on views, and components
	var app =  angular.module('smallBusiness', [
	  'ngRoute', 'routeResolverServices', 'ui.bootstrap', 'customDirectives', 'customServices', 'customFilters', 'angularFileUpload', 'ngCookies', 'ngSanitize'
	]);
	app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider', 
				function($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {
				
				//Change default views and controllers directory using the following:
				routeResolverProvider.routeConfig.setBaseDirectories('modules/', 'modules/');
				app.register =
				{
					controller: $controllerProvider.register,
					directive: $compileProvider.directive,
					filter: $filterProvider.register,
					factory: $provide.factory,
					service: $provide.service
				};
				
				//Define routes - controllers will be loaded dynamically
				var route = routeResolverProvider.route;
				
				$routeProvider
                
                .when('/', route.resolve({controller:'login', template: 'login', label:"Home"}, 'users/login/')) 
				// Always home url is '/' so please don't change this. In future home view can be changed.
				
				.when('/login', route.resolve({controller:'login', template: 'login', label: 'Login'}, 'users/login/'))
				
				.when('/logout', route.resolve({controller:'login', template: 'logout', label: 'Logout'}, 'users/login/'))
				
				.when('/changepass',route.resolve({controller: 'editprofile',template: 'changepass',label: "Change Password"
                }, 'users/editprofile/')) 
				
				.when('/changepass/:resetPassKey',route.resolve({controller: 'login',template: 'changepass',label: "Change Password"
                }, 'users/login/'))
				
				.when('/activate/:activateKey/:email/:pass?',route.resolve({controller: 'login',template: 'activate',label: "Activate Account"
                }, 'users/login/'))
				
				.when('/register', route.resolve({controller:'register', template: 'register', label: 'Register'}, 'users/register/'))
				
				.when('/forgotpass', route.resolve({controller:'login', template: 'forgotpass', label: 'Forgot Password'}, 'users/login/'))
				
				.when('/editprofile', route.resolve({controller:'editprofile', template: 'editprofile',label:"Edit Profile"}, 'users/editprofile/'))
	
				
                .when('/dashboard', route.resolve({controller:'dashboard', template: 'dashboard', label: "Dashboard"}, 'dashboard/'))
				
				.when('/dashboard/users', route.resolve({controller:'manageuser', template: 'manageuser', label: 'Users'}, 'users/manageuser/'))
				
				.when('/dashboard/users/:userViews?/:id?', route.resolve({controller:'manageuser', template: 'manageuser', label: "Manage Users"}, 'users/manageuser/'))
				
				.when('/dashboard/enquiry/:mailId?/:id?', route.resolve({controller:'enquiry', template: 'enquiry',label:"Mail Box"}, 'enquiry/'))
				
				.when('/dashboard/templates/:tempPart?', route.resolve({controller:'templates', template: 'templates',label:"Template"}, 'templates/'))
				
				// Always Add Static Route before dynamic route/dynamic parameter
				.when('/dashboard/business/addbusiness/:id?', route.resolve({controller:'addbusiness', template: 'addbusiness',label:"Add New Business"}, 'business/addbusiness/'))
				
				.when('/dashboard/business/adddetails/:id?', route.resolve({controller:'adddetails', template: 'adddetails',label:"Business Details"}, 'business/adddetails/'))
				
				.when('/dashboard/business/products/:productView?', route.resolve({controller:'products', template: 'products',label:"Products & Services"}, 'business/products/'))
				
				.when('/dashboard/business/:businessView?', route.resolve({controller:'business', template: 'business',label:"Business"}, 'business/'))
				
				.when('/dashboard/websites/websettings/:id', route.resolve({controller:'websettings', template: 'websettings',label:"Website Settings"}, 'websites/websettings/'))
				
				.when('/dashboard/websites/:websitePart?', route.resolve({controller:'websites', template: 'websites',label:"Websites"}, 'websites/'))
				
                .otherwise({ redirectTo: '/' });
				
	}]);
	
		
	app.run(['$location', '$rootScope', 'breadcrumbs','dataService','$cookieStore', '$cookies','$routeParams', function($location, $rootScope, breadcrumbs, dataService, $cookieStore, $cookies,$routeParams) {
		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			$rootScope.userDetails = dataService.parse(dataService.userDetails);
			$rootScope.breadcrumbs = breadcrumbs;
			$rootScope.appConfig = {
				metaTitle : "Small Business",
				headerTitle : next.$$route.label,
				subTitle : next.$$route.label,
				assetPath : '../server-api'
			};
			var nextUrl = next.$$route.originalPath;
			if(nextUrl == '/logout' || dataService.auth == false){
				dataService.logout();
				$rootScope.userDetails = null;
			}
			if(dataService.auth == false || $rootScope.userDetails == null){
				var changePassUrl = '"/changepass/'+next.pathParams.resetPassKey+'"';
				if (nextUrl == '/forgotpass' || nextUrl == '/register' || nextUrl == '/login' || nextUrl == '/' || nextUrl == '/logout' || nextUrl == '/changepass/:resetPassKey' || nextUrl == '/activate/:activateKey/:email/:pass?') {
				} else {
					$location.path("/login");
					$rootScope.alerts = [{type: "warning", msg: "You are not logged in!"}];
				}
			}else{
				if (nextUrl == '/forgotpass' || nextUrl == '/register' || nextUrl == '/login' || nextUrl == '/' || nextUrl == '/changepass/:resetPassKey' || nextUrl == '/activate/:activateKey/:email/:pass?') {
					$location.path("/dashboard");
				}
			};
		});
	}]);
	return app;
});