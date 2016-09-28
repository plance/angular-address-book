'use strict';

angular.module('AppBook.User.Work', [
	'ui.router',
	'firebase',
	'ui.bootstrap'
])

.controller('UserWorkController', [
'AppConfig', '$scope', '$stateParams', '$firebaseArray', '$uibModal',
function(AppConfig, $scope, $stateParams, $firebaseArray, $uibModal)
{
	var RefWorks = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Works');
	$scope.Works = $firebaseArray(RefWorks);

	$scope.showModalAddWork = function() {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-user-work-address',
			controller: [
			'$scope', '$uibModalInstance',
			function($scope, $uibModalInstance)
			{
				$scope.title 			= 'Создание рабочего адреса';
				$scope.building_title 	= 'Здание';
				$scope.room_title 		= 'Офис';

				$scope.Address = {
					country: '',
					zip: '',
					area: '',
					city: '',
					address: '',
					building: '',
					room: '',
					organization: '',
					department: '',
					post: '',
					is_primary: ''
				};

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.submit = function() {
					var Promise = RefWorks.push({
						country: $scope.Address.country,
						zip: $scope.Address.zip,
						area: $scope.Address.area,
						city: $scope.Address.city,
						address: $scope.Address.address,
						building: $scope.Address.building,
						room: $scope.Address.room,
						organization: $scope.Address.organization,
						department: $scope.Address.department,
						post: $scope.Address.post,
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

	$scope.showModalEditWork = function(work_id) {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-user-work-address',
			controller: [
			'AppConfig', '$scope', '$stateParams', '$firebaseObject', '$uibModalInstance',
			function(AppConfig, $scope, $stateParams, $firebaseObject, $uibModalInstance)
			{
				$scope.title 			= 'Редактирование рабочего адреса';
				$scope.building_title 	= 'Здание';
				$scope.room_title 		= 'Офис';

				var RefWork		= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Works/' + work_id);
				$scope.Address 	= $firebaseObject(RefWork);

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.submit = function() {
					var Promise = RefWork.update({
						country: $scope.Address.country,
						zip: $scope.Address.zip,
						area: $scope.Address.area,
						city: $scope.Address.city,
						address: $scope.Address.address,
						building: $scope.Address.building,
						room: $scope.Address.room,
						organization: $scope.Address.organization,
						department: $scope.Address.department,
						post: $scope.Address.post,
						is_primary: $scope.Address.is_primary == '' ? 'no' : $scope.Address.is_primary,
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

	$scope.showModalDeleteWork = function(work_id) {
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
					var RefWork		= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Works/' + work_id);
					var Promise = RefWork.remove(function(error) {
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$uibModalInstance.close();
						$location.path('/book/' + $stateParams.book_id + '/' + $stateParams.user_id + '/work');
					}
				};
			}]
		});
	};
}])

.controller('UserWorkContactController', [
'AppConfig', 'AppService', '$scope', '$location', '$stateParams', '$firebaseObject', '$firebaseArray', '$uibModal',
function(AppConfig, AppService, $scope, $location, $stateParams, $firebaseObject, $firebaseArray, $uibModal)
{
	$scope.contacts = AppService.contacts;
	var RefWork 	= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Works/' + $stateParams.work_id);
	var RefContacts = RefWork.child('Contacts');
	$scope.Address 	= $firebaseObject(RefWork);
	$scope.Contacts = $firebaseArray(RefContacts);

	RefWork.once("value", function(s) {
		if(s.hasChildren() === false)
		{
			$location.path('/book/' + $stateParams.book_id + '/' + $stateParams.user_id + '/work');
		}
	});

	$scope.showModalAddContact = function() {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-contact',
			/* *
			 * TODO Контроллер возможно стоит вынести в самостоятельный, и использовать его в разных модальных окнах
			 * аналогично сделать и в удалении, и пр.
			 * */
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

				var RefContact 	= new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Works/' + $stateParams.work_id + '/Contacts/' + contact_id);
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
					var RefContact = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id + '/Works/' + $stateParams.work_id + '/Contacts/' + contact_id);
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
