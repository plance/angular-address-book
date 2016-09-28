'use strict';

angular.module('AppBook.User.Contact', [
	'ui.router',
	'firebase',
	'ui.bootstrap'
])

.controller('UserContactController', [
'AppConfig', 'AppService', '$scope', '$stateParams', '$firebaseArray', '$uibModal',
function(AppConfig, AppService, $scope, $stateParams, $firebaseArray, $uibModal)
{
	$scope.contacts = AppService.contacts;

	var RefContacts = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Contacts');
	$scope.Contacts = $firebaseArray(RefContacts);

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
				$scope.title = 'Редактирование контакта';
				$scope.contacts = AppService.contacts;

				var RefContact = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Contacts/' + contact_id);
				$scope.Contact = $firebaseObject(RefContact);

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
					var RefContact = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Contacts/' + contact_id);
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
