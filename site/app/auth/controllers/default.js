'use strict';

angular.module('AppBook.Auth', [
	'ui.router',
	'firebase',
	'ui.bootstrap'
])

.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'app/auth/view/default/login.html',
			controller: 'AuthLoginController'
		})
		.state('registration', {
			url: '/registration',
			templateUrl: 'app/auth/view/default/registration.html',
			controller: 'AuthRegistrationController'
		})
		.state('logout', {
			url: '/logout',
			controller: 'AuthLogoutController'
		})
	;
}])

.controller('AuthLoginController', [
'AppConfig', 'AppService', '$scope', '$rootScope', '$location', '$firebaseAuth',
function(AppConfig, AppService, $scope, $rootScope, $location, $firebaseAuth)
{
	var Ref = $firebaseAuth(
		new Firebase(AppConfig.firebase.url)
	);

	$scope.submit = function()
	{
		Ref.$authWithPassword({
			email: $scope.Auth.email,
			password: $scope.Auth.password
		}).then(function(auth){
			console.log('Authentication successful');

			$rootScope.User = auth;
			AppService.setUser(auth);
			$location.path('/book');
		}, function(error) {
			console.log('Authentication failure');
			console.log(error.message);

			$scope.is_error = true;
			$scope.error_message = error.message;
		});
	};
}])

.controller('AuthRegistrationController', [
'AppConfig', 'AppService', '$scope', '$location', '$firebaseAuth',
function(AppConfig, AppService, $scope, $location, $firebaseAuth)
{
	var Ref = $firebaseAuth(
		new Firebase(AppConfig.firebase.url)
	);

	$scope.submit = function()
	{
		Ref.$createUser({
			email: $scope.Auth.email,
			password: $scope.Auth.password
		})
		.then(function() {
			console.log('Registration successful');

			$location.path('/login');
		}, function(error) {
			console.log('Registration failure');
			console.log(error.message);

			$scope.is_error = true;
			$scope.error_message = error.message;
		});
	};
}])

.controller('AuthLogoutController', [
'AppConfig', 'AppService', '$rootScope', '$location',
function(AppConfig, AppService, $rootScope, $location)
{
	try
	{
		var Ref = new Firebase(AppConfig.firebase.url);
		Ref.onAuth(function(auth){
			if(auth)
			{
				Ref.unauth();
				location.reload();
			}
		});
		console.log('Logout successful');
	}
	catch(e)
	{
		console.log('Logout wrong');
	}

	AppService.setUser({});
	$rootScope.User = {};
	$location.path('/login');
}])
;
