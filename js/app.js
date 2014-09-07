/* Routing Configs */

myApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/Login', {
				templateUrl: 'partials/loginPage.html',
				controller: 'LoginController as loginData'
			}).
			when('/Question', {
				templateUrl: 'partials/questionPage.html',
				controller: 'QuestionController as questionData'
			}).
			when('/Search', {
				templateUrl: 'partials/searchPage.html',
				controller: 'SearchController as searchData'
			}).
			when('/Home', {
				templateUrl: 'partials/homePage.html',
				controller: 'HomeController as homeData'
			}).
			otherwise({
				redirectTo: '/Login'
			});
}]);

//TagCloud Settings
$.fn.tagcloud.defaults = {
    size: {start: 14, end: 24, unit: 'pt'},
    color: {start: '#fff', end: '#2a6496'}
};
