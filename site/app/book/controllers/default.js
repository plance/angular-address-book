'use strict';

angular.module('AppBook.Book', [
	'ui.router',
	'firebase',
	'ui.bootstrap'
])

.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('book', {
			url: '/book',
			templateUrl: 'app/book/view/default/index.html',
			controller: 'BookController'
		})
		.state('book-add', {
			url: '/book/add',
			templateUrl: 'app/book/view/default/add.html',
			controller: 'BookAddController'
		})
		.state('book-edit', {
			url: '/book/edit/:book_id',
			templateUrl: 'app/book/view/default/add.html',
			controller: 'BookEditController'
		})
		.state('book-view', {
			url: '/book/:book_id',
			templateUrl: 'app/book/view/default/view.html',
			controller: 'BookViewController'
		})
	;
}])

.controller('BookController', [
'AppConfig', '$scope', '$firebaseArray',
function(AppConfig, $scope, $firebaseArray)
{
	$scope.count_ar = new Array();

	var RefBooks = new Firebase(AppConfig.firebase.url + '/Books');
	RefBooks.on('child_added', function(snapshot) {
		$scope.count_ar[snapshot.key()] = snapshot.child("Users").numChildren();
	});

	$scope.Books = $firebaseArray(RefBooks);
}])

.controller('BookAddController', [
'AppConfig', '$scope', '$location',
function(AppConfig, $scope, $location)
{
	$scope.page_title = 'Создание адресной книги';
	$scope.breadcrumbs = [
		{link: '#/book', title: 'Адресные книги'},
		{link: null, title: $scope.page_title}
	];

	$scope.submit = function(){
		var RefBooks = new Firebase(AppConfig.firebase.url + '/Books');

		var Promise = RefBooks.push({
			title: $scope.Book.title,
			date_create: new Date().getTime()
		}, function(error){
			if(error)
			{
				console.log("Error:", error);
			}
		});
		if(Promise)
		{
			$scope.Book = {};
			$location.path('/book');
		}
	};
}])

.controller('BookEditController', [
'AppConfig', '$scope', '$location', '$stateParams', '$firebaseObject',
function(AppConfig, $scope, $location, $stateParams, $firebaseObject)
{
	$scope.page_title = 'Редактирование адресной книги';

	var RefBook = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id);
	var Book	= $firebaseObject(RefBook);
	$scope.Book = Book;

	Book.$loaded(function(d) {
		$scope.breadcrumbs = [
			{link: '#/book', title: 'Адресные книги'},
			{link: '#/book/' + d.$id, title: d.title},
			{link: null, title: $scope.page_title}
		];
	});

	$scope.submit = function(){
		var Promise = RefBook.update({
			title: $scope.Book.title
		}, function(error){
			if(error)
			{
				console.log("Error:", error);
			}
		});
		if(Promise)
		{
			$scope.Book = {};
			$location.path('/book');
		}
	};
}])

.controller('BookViewController', [
'AppConfig', '$scope', '$location', '$stateParams', '$firebaseObject', '$firebaseArray', '$uibModal',
function(AppConfig, $scope, $location, $stateParams, $firebaseObject, $firebaseArray, $uibModal) {
	var RefBook = new Firebase(AppConfig.firebase.url + '/Books/' + $stateParams.book_id);

	$scope.Book = $firebaseObject(RefBook);
	$scope.Users = $firebaseArray(RefBook.child('Users'));

	$scope.showModalDelete = function() {
		$uibModal.open({
			animation: true,
			size: 'sm',
			templateUrl: 'modal-delete',
			controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
				$scope.message = 'Удалить адресную книгу?';
				$scope.cancel = function() {
					$uibModalInstance.close();
				};
				$scope.delete = function(){
					var Promise = RefBook.remove(function(error){
						if(error)
						{
							console.log("Error:", error);
						}
					});
					if(Promise)
					{
						$uibModalInstance.close();
						$location.path('/book');
					}
			   };
			}]
		});
	};
}])
;
