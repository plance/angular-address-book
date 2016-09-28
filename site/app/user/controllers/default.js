'use strict';

angular.module('AppBook.User', [
	'ui.router',
	'firebase',
	'ui.bootstrap'
])

.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('user-add', {
			url: '/user/add/:book_id',
			templateUrl: 'app/user/view/default/add.html',
			controller: 'UserAddController'
		})
		.state('user-edit', {
			url: '/user/edit/:book_id/:user_id',
			templateUrl: 'app/user/view/default/add.html',
			controller: 'UserEditController'
		})
		.state('user-view', {
			url: '/book/:book_id/:user_id',
			templateUrl: 'app/user/view/default/view.html',
			controller: 'UserViewController'
		})
			.state('user-view.contact', {
				url: '/contact',
				data: {
					page: 'contact'
				},
				templateUrl: 'app/user/view/contact/index.html',
				controller: 'UserContactController',
			})
			.state('user-view.home', {
				url: '/home',
				data: {
					page: 'home'
				},
				templateUrl: 'app/user/view/home/index.html',
				controller: 'UserHomeController',
			})
				.state('user-view.home.contact', {
					url: '/:home_id',
					templateUrl: 'app/user/view/home/contact.html',
					controller: 'UserHomeContactController',
				})
			.state('user-view.work', {
				url: '/work',
				data: {
					page: 'work'
				},
				templateUrl: 'app/user/view/work/index.html',
				controller: 'UserWorkController',
			})
				.state('user-view.work.contact', {
					url: '/:work_id',
					templateUrl: 'app/user/view/work/contact.html',
					controller: 'UserWorkContactController',
				})
	;
}])

.controller('UserAddController', [
'AppConfig', 'UserService', '$scope', '$location', '$stateParams', '$firebaseObject', 'dateFilter',
function(AppConfig, UserService, $scope, $location, $stateParams, $firebaseObject, dateFilter)
{
	$scope.page_title = 'Создание контакта';
	$scope.User		  = {
		first_name : '',
		last_name : '',
		patronymic : '',
		display_name : '',
		nickname : '',
		birthday : '',
		sex : ''
	};
	$scope.Datepicker = UserService.Datepicker;

	var Book = $firebaseObject(
		new Firebase(AppConfig.firebase.url + '/Books/'+ $stateParams.book_id)
	);

	Book.$loaded(function(d) {
		$scope.breadcrumbs = [
			{link: '#/book', title: 'Адресные книги'},
			{link: '#/book/' + d.$id, title: d.title},
			{link: null, title: $scope.page_title}
		];
	});

	$scope.submit = function()
	{
		var RefUsers = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users');
		var Promise = RefUsers.push({
			first_name: $scope.User.first_name,
			last_name: $scope.User.last_name,
			patronymic: $scope.User.patronymic,
			display_name: $scope.User.display_name,
			nickname: $scope.User.nickname,
			birthday: dateFilter($scope.User.birthday, 'yyyy.MM.dd'),
			sex: $scope.User.sex,
			date_create: new Date().getTime()
		}, function(error) {
			if(error)
			{
				console.log("Error:", error);
			}
		});
		if(Promise)
		{
			$scope.User = {};
			$location.path('/user/edit/' + $stateParams.book_id + '/' + Promise.key());
		}
	};
}])

.controller('UserEditController', [
'AppConfig', 'UserService', '$scope', '$location', '$stateParams', '$firebaseObject', 'dateFilter',
function(AppConfig, UserService, $scope, $location, $stateParams, $firebaseObject, dateFilter)
{
	$scope.page_title = 'Редактирование контакта';
	$scope.Datepicker = UserService.Datepicker;
	$scope.User = {birthday: '2001.01.01'};

	var Book = $firebaseObject(
		new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id)
	);

	var RefUser = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id + '/Users/' + $stateParams.user_id);
	var User = $firebaseObject(RefUser);
	$scope.User = User;

	Book.$loaded(function(local_book) {
		User.$loaded(function(local_user) {
			$scope.breadcrumbs = [
				{link: '#/book', title: 'Адресные книги'},
				{link: '#/book/' + local_book.$id, title: local_book.title},
				{link: '#/book/' + local_book.$id + '/' + local_user.$id + '/contact', title: local_user.display_name},
				{link: null, title: $scope.page_title}
			];
			$scope.User.birthday = new Date(local_user.birthday);
		});
	});

	$scope.submit = function() {
		var Promise = RefUser.update({
			first_name: $scope.User.first_name,
			last_name: $scope.User.last_name,
			patronymic: $scope.User.patronymic,
			display_name: $scope.User.display_name,
			nickname: $scope.User.nickname,
			birthday: dateFilter($scope.User.birthday, 'yyyy.MM.dd'),
			sex: $scope.User.sex
		}, function(error){
			if(error)
			{
				console.log("Error:", error);
			}
		});
		if(Promise)
		{
			$location.path('/book/' + $stateParams.book_id + '/' + $stateParams.user_id + '/contact');
		}
	};
}])

.controller('UserViewController', [
'AppConfig', '$scope', '$location', '$stateParams', '$state', '$firebaseObject', '$uibModal',
function(AppConfig, $scope, $location, $stateParams, $state, $firebaseObject, $uibModal)
{
	var RefBook = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id);
	var FbUser = RefBook.child('Users/' + $stateParams.user_id);
	$scope.current_tab = $state.current.data.page;

	RefBook.once('value', function(snapshot) {
		$scope.count_users = snapshot.child('Users').numChildren();
	});

	$scope.Book = $firebaseObject(RefBook);
	$scope.User = $firebaseObject(FbUser);

	$scope.showModalDeleteUser = function() {
		$uibModal.open({
			animation: true,
			size: 'sm',
			templateUrl: 'modal-delete',
			controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
				$scope.message = 'Удалить контакт?';

				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.delete = function() {
					var Promise = FbUser.remove(function(error) {
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						console.log('The data has been deleted');
						$uibModalInstance.close();
						$location.path('/book/' + $stateParams.book_id);
					}
			   };
			}]
		});
	};

	$scope.showModalMoveUser = function() {
		$uibModal.open({
			animation: true,
			templateUrl: 'modal-user-move',
			controller: [
			'AppConfig', '$scope', '$uibModalInstance', '$firebaseArray',
			function(AppConfig, $scope, $uibModalInstance, $firebaseArray)
			{
				$scope.Books = $firebaseArray(
					new Firebase(AppConfig.firebase.url + '/Books')
				);
				$scope.cancel = function() {
				   $uibModalInstance.close();
				};
				$scope.move = function() {
					FbUser.once('value', function(s) {
						var RefBookMove = new Firebase(AppConfig.firebase.url + '/Books/' + $scope.Book.$id + '/Users');
						var Promise = RefBookMove.push(s.exportVal(),
							function(error) {
							if(error)
							{
								console.log("Error:", error);
							}
						});
						if(Promise)
						{
							$uibModalInstance.close();
							console.log('The data has been moved');

							/*TODO вынести в сервис*/
							var Promise = FbUser.remove(function(error) {
								if(error)
								{
									console.log("Error:", error);
								}
							});
							if(Promise)
							{
								console.log('The data has been deleted');
								$uibModalInstance.close();
								$location.path('/book/' + $stateParams.book_id);
							}
						}
					});
			   };
				$scope.copy = function() {
					FbUser.once('value', function(s) {
						var RefBookMove = new Firebase(AppConfig.firebase.url + '/Books/' + $scope.Book.$id + '/Users');
						var Promise = RefBookMove.push(s.exportVal(),
							function(error) {
							if(error)
							{
								console.log("Error:", error);
							}
						});
						if(Promise)
						{
							$uibModalInstance.close();
							console.log('The data has been copied');
						}
					});
			   };
			}]
		});
	};
}])

.service('UserService', [function() {
	return {
		Address: {
			country: '',
			zip: '',
			area: '',
			city: '',
			address: '',
			building: '',
			room: '',
			is_primary: ''
		},
		Datepicker: {
			opened: false,
			options: {
				formatYear: 'yyyy',
				formatMonth: 'MM',
				formatDay: 'dd',
				maxDate: new Date(),
				startingDay: 1
			},
			open: function() {
				this.opened = true;
			}
		}
	};
}])
;
