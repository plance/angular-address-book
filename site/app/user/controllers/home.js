'use strict';

angular.module('AppBook.User.Home', [
	'ui.router',
	'firebase',
	'ui.bootstrap'
])

.controller('UserHomeController', [
'AppConfig', '$scope', '$stateParams', '$firebaseArray', '$uibModal',
function(AppConfig, $scope, $stateParams, $firebaseArray, $uibModal)
{
	var RefHomes = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Homes');
	$scope.Homes = $firebaseArray(RefHomes);

	$scope.showModalAddHome = function() {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-user-home-address',
			controller: [
			'$scope', '$uibModalInstance',
			function($scope, $uibModalInstance)
			{
				$scope.title 			= 'Создание домашнего адреса';
				$scope.building_title 	= 'Дом';
				$scope.room_title 		= 'Квартира';

				$scope.Address = {
					country: '',
					zip: '',
					area: '',
					city: '',
					address: '',
					building: '',
					room: '',
					is_primary: ''
				};

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.submit = function() {
					var Promise = RefHomes.push({
						country: $scope.Address.country,
						zip: $scope.Address.zip,
						area: $scope.Address.area,
						city: $scope.Address.city,
						address: $scope.Address.address,
						building: $scope.Address.building,
						room: $scope.Address.room,
						is_primary: $scope.Address.is_primary == '' ? 'no' : $scope.Address.is_primary,
						date_create: new Date().getTime()
					}, function(error){
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$scope.Address = {};
						$uibModalInstance.close();
					}
				};
			}]
		});
	};

	$scope.showModalEditHome = function(home_id) {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-user-home-address',
			controller: [
			'AppConfig', '$scope', '$stateParams', '$firebaseObject', '$uibModalInstance',
			function(AppConfig, $scope, $stateParams, $firebaseObject, $uibModalInstance)
			{
				$scope.title 			= 'Редактирование домашнего адреса';
				$scope.building_title 	= 'Дом';
				$scope.room_title 		= 'Квартира';

				var RefHome 	= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Homes/' + home_id);
				$scope.Address 	= $firebaseObject(RefHome);

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.submit = function() {
					var Promise = RefHome.update({
						country: $scope.Address.country,
						zip: $scope.Address.zip,
						area: $scope.Address.area,
						city: $scope.Address.city,
						address: $scope.Address.address,
						building: $scope.Address.building,
						room: $scope.Address.room,
						is_primary: $scope.Address.is_primary == '' ? 'no' : $scope.Address.is_primary
					}, function(error){
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$scope.Address = {};
						$uibModalInstance.close();
					}
				};
			}]
		});
	};

	$scope.showModalDeleteHome = function(home_id) {
		$uibModal.open({
			animation: true,
			size: 'sm',
			templateUrl: 'modal-delete',
			controller: [
			'AppConfig', '$scope', '$location', '$stateParams', '$uibModalInstance',
			function(AppConfig, $scope, $location, $stateParams, $uibModalInstance)
			{
				$scope.message = 'Удалить выбранный адрес?';

				$scope.cancel = function() {
					$uibModalInstance.close();
				};
				$scope.delete = function() {
					var RefHome = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Homes/' + home_id);
					var Promise = RefHome.remove(function(error) {
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$uibModalInstance.close();
						$location.path('/book/' + $stateParams.book_id + '/' + $stateParams.user_id + '/home');
					}
				};
			}]
		});
	};
}])

.controller('UserHomeContactController', [
'AppConfig', 'AppService', '$scope', '$location', '$stateParams', '$firebaseObject', '$firebaseArray', '$uibModal',
function(AppConfig, AppService, $scope, $location, $stateParams, $firebaseObject, $firebaseArray, $uibModal)
{
	$scope.contacts = AppService.contacts;
	var RefHome 	= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Homes/' + $stateParams.home_id);
	var RefContacts = RefHome.child('Contacts');
	$scope.Address 	= $firebaseObject(RefHome);
	$scope.Contacts = $firebaseArray(RefContacts);

	RefHome.once("value", function(s) {
		if(s.hasChildren() === false)
		{
			$location.path('/book/' + $stateParams.book_id + '/' + $stateParams.user_id + '/home');
		}
	});

	$scope.showModalAddContact = function() {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-contact',
			controller: [
			'AppService', '$scope', '$uibModalInstance',
			function(AppService, $scope, $uibModalInstance)
			{
				$scope.title = 'Создание контакта';
				$scope.contacts = AppService.contacts;
				$scope.Contact = {
					type: '',
					content: ''
				};

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.submit = function() {
					var Promise = RefContacts.push({
						type: $scope.Contact.type,
						content: $scope.Contact.content,
						date_create: new Date().getTime()
					}, function(error){
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$scope.Contact = {};
						$uibModalInstance.close();
					}
				};
			}]
		});
	};

	$scope.showModalEditContact = function(contact_id) {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-contact',
			controller: [
			'AppConfig', 'AppService', '$scope', '$stateParams', '$firebaseObject', '$uibModalInstance',
			function(AppConfig, AppService, $scope, $stateParams, $firebaseObject, $uibModalInstance)
			{
				$scope.title 	= 'Редактирование контакта';
				$scope.contacts = AppService.contacts;

				var RefContact 	= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Homes/' + $stateParams.home_id + '/Contacts/' + contact_id);
				$scope.Contact 	= $firebaseObject(RefContact);

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.submit = function() {
					var Promise = RefContact.update({
						type: $scope.Contact.type,
						content: $scope.Contact.content
					}, function(error){
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$scope.Contact = {};
						$uibModalInstance.close();
					}
				};
			}]
		});
	};

	$scope.showModalDeleteContact = function(contact_id) {
		$uibModal.open({
			animation: true,
			size: 'sm',
			templateUrl: 'modal-delete',
			controller: [
			'AppConfig', '$scope', '$stateParams', '$uibModalInstance',
			function(AppConfig, $scope, $stateParams, $uibModalInstance)
			{
				$scope.message = 'Удалить контактную информацию?';

				$scope.cancel = function() {
					$uibModalInstance.close();
				};
				$scope.delete = function() {
					var RefContact = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Homes/' + $stateParams.home_id + '/Contacts/' + contact_id);
					var Promise = RefContact.remove(function(error) {
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$uibModalInstance.close();
					}
				};
			}]
		});
	};
}])
;
