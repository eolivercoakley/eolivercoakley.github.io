var myApp = angular.module('stackExchangeApp', ['ngRoute']);

console.error("Initial location: ", location.href);

myApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/login', {
				templateUrl: 'partials/loginPage.html',
				controller: 'LoginController as loginData'
			}).
			when('/question', {
				templateUrl: 'partials/questionPage.html',
				controller: 'QuestionController'
			}).
			when('/search', {
				templateUrl: 'partials/searchPage.html',
				controller: 'SearchController'
			}).
			when('/home', {
				templateUrl: 'partials/homePage.html',
				controller: 'HomeController as homeData'
			}).
			otherwise({
				redirectTo: '/login'
			});
}]);