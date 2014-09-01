var myApp = angular.module('stackExchangeApp', ['ngRoute']);

console.error("Initial location: ", location.href);

window.globalObject = {
	"access_token" : null
};

$(document).ready(function(){
	console.error("When do we get here?");	
	console.error("Also current location: ", location.href);
	console.error("Also current hash: ", location.hash);
	var urlParams = location.hash.substring(location.hash.indexOf('#') + 1).split('&');
	for (var i = 0; i < urlParams.length; i++) {
    	var pair = urlParams[i].split('=');
    	window.globalObject[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  	}
	console.error(window.globalObject);
});

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