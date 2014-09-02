var myApp = angular.module('stackExchangeApp', ['ngRoute']);

console.error("Initial location: ", location.href);

window.globalObject = {
	"access_token" : null
};

//Singleton to obtain access data from the url before the page is re-routed.
(function(){
	var urlParams = location.hash.substring(location.hash.indexOf('#') + 1).split('&');
	for (var i = 0; i < urlParams.length; i++) {
    	var pair = urlParams[i].split('=');
    	window.globalObject[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  	}
})();

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