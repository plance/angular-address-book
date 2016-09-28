'use strict';

angular.module('AppBook', [
	'ui.router',

	'AppBook.Auth',
	'AppBook.Book',
	'AppBook.User',
	'AppBook.User.Contact',
	'AppBook.User.Home',
	'AppBook.User.Work',

	'AppBook.Service.App',
	'AppBook.Config.App'
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
}])

.run([
'AppConfig', 'AppService', '$rootScope', '$state',
function(AppConfig, AppService, $rootScope, $state)
{
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams)
	{
		if(AppService.getUser().uid === undefined)
		{
			var Ref = new Firebase(AppConfig.firebase.url);
			Ref.onAuth(function(auth){
				if(auth)
				{
					$rootScope.User = auth;
					AppService.setUser(auth);
					$state.go(toState.name, toParams);
				}
				else if(toState.name !== 'login' && toState.name !== 'registration')
				{
					event.preventDefault();
					$state.go('login');
				}
			});
		}
	});
}])

.controller('AppController', [
'AppService', '$scope', '$rootScope',
function(AppService, $scope, $rootScope)
{
	$rootScope.User = AppService.getUser();
	$scope.year = new Date().getFullYear();
}])
;
