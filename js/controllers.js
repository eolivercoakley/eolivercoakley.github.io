/**
 * Created by ecoakley on 8/28/2014.
 */

var stackExchangeControllers = angular.module('stackExchangeControllers', []);

stackExchangeControllers.controller('HomeController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	  	
    $scope.getUserInfo = function(){
		loadStackExchangeAPIData("loginInfo", "https://api.stackexchange.com/2.2/me?order=desc&sort=reputation&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=ZpEI9T55tXuPT2TjmJRu3A))&callback=JSON_CALLBACK");
	};  

    $scope.getBadgesInfo = function(){
    	loadStackExchangeAPIData("badgesInfo", "https://api.stackexchange.com/2.2/me/badges?order=desc&sort=rank&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=ZpEI9T55tXuPT2TjmJRu3A))&callback=JSON_CALLBACK");
    };    

    $scope.getTimelineInfo = function(){
    	loadStackExchangeAPIData("timelineInfo", "https://api.stackexchange.com/2.2/me/timeline?site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=ZpEI9T55tXuPT2TjmJRu3A))&callback=JSON_CALLBACK");
    };  
    
	$scope.getFavorites = function(){
    	loadStackExchangeAPIData("favoritesInfo", "https://api.stackexchange.com/2.2/me/favorites?order=desc&sort=activity&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=ZpEI9T55tXuPT2TjmJRu3A))&callback=JSON_CALLBACK");
    }; 
    
	$scope.getTagCloudInfo = function(){
    	loadStackExchangeAPIData("favoritesInfo", "https://api.stackexchange.com/2.2/me/tags?order=desc&sort=popular&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=ZpEI9T55tXuPT2TjmJRu3A))&callback=JSON_CALLBACK");
    };  

	function loadStackExchangeAPIData(scopeName, url){
		if(!($scope[scopeName])){
			$http.jsonp(url).success(function(data) {
					$scope[scopeName] = data.items[0];
					console.error(data);
			});			
		}
	}


}]);

stackExchangeControllers.controller('LoginController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	
    
	$scope.stackExchangeLogin = function(){
        SE.init({
            // Parameters obtained by registering an app, these are specific to the SE
            // documentation site
            clientId: 3523,
            key: 'C8mLfFHVyj1TGEfdDQTEYw((',
            // Used for cross domain communication, it will be validated
            channelUrl: 'http://eolivercoakley.github.io',
            // Called when all initialization is finished
            complete: function(data) {
                $('#login-button')
                    .removeAttr('disabled')
                    .text('Login');
            }
        });
        // Attach click handler to login button
        $('#login-button').click(function() {
        	console.error("bacon!");
            // Make the authentication call, note that being in an onclick handler
            // is important; most browsers will hide windows opened without a
            // 'click blessing'
            SE.authenticate({
                success: function(data) {
                    /*alert(
                        'User Authorized with account id = ' +
                        data.networkUsers[0].account_id + ', got access token = ' +
                        data.accessToken
                    );*/
                    $scope.loginCredentials = data;
                },
                error: function(data) {
                    alert('An error occurred:\n' + data.errorName + '\n' + data.errorMessage);
                },
                networkUsers: true
            });
        });
	}();


}]);
