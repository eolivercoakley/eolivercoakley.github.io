/* Routing Configs */

myApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/login', {
				templateUrl: 'partials/loginPage.html',
				controller: 'LoginController as loginData'
			}).
			when('/question', {
				templateUrl: 'partials/questionPage.html',
				controller: 'QuestionController as questionData'
			}).
			when('/search', {
				templateUrl: 'partials/searchPage.html',
				controller: 'SearchController as searchData'
			}).
			when('/home', {
				templateUrl: 'partials/homePage.html',
				controller: 'HomeController as homeData'
			}).
			otherwise({
				redirectTo: '/login'
			});
}]);