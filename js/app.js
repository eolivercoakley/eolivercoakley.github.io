var stackExchangeApp = angular.module('stackExchangeApp', [
  'ngRoute',
  'stackExchangeControllers'
]);

stackExchangeApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/login', {
				templateUrl: '../partials/loginPage.html',
				controller: 'LoginController'
			}).
			when('/question', {
				templateUrl: '../partials/questionPage.html',
				controller: 'QuestionController'
			}).
			when('/search', {
				templateUrl: '../partials/searchPage.html',
				controller: 'SearchController'
			}).
			when('/home', {
				templateUrl: '../partials/homePage.html',
				controller: 'HomeController'
			}).
			otherwise({
				redirectTo: '/login',
				controller: 'LoginController'
			});
}]);