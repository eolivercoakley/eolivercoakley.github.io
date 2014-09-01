/**
 * Created by ecoakley on 8/28/2014.
 */


myApp.factory('userLoginAuthentication', ['$http',  function($http) {
	console.error("ATTEMPTING LOGIN INIT!");
	
  	var authenticationInfo = {};	
	
	var authentication_cache;
		
	(function (){
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
	})();
	
	// Make the authentication call, note that being in an onclick handler
        // is important; most browsers will hide windows opened without a
        // 'click blessing'
        authenticationInfo.authenticate = function(){
        	return (authentication_cache = SEauthentication(authentication_cache)); 	
        };
        
        function SEauthentication(authentication_cache_object){
        	console.error("authobj",authentication_cache_object);
        	if(!authentication_cache_object){
        		authentication_cache_object = SE.authenticate({
		            success: function(data) {
		                console.error("Success", data);
		                return data;
		            },
		            error: function(data) {
		                alert('An error occurred:\n' + data.errorName + '\n' + data.errorMessage);
		            },
		            networkUsers: true
		        });
        	}
        	console.error("End of the day, this is the cache object: ", authentication_cache_object);
        	return authentication_cache_object;
        };
        
    return authenticationInfo;
}]);


myApp.factory('allUserData', ['$http',  function($http) {
		
	console.error("Building out the user data request...");
  	
  	var allUserInfo = {};	
  	var accessToken = "(mZUdl3i(U*5(q*jl*SNkw))";
  	var promise_userInfo, promise_userBadgesInfo, promise_userTimelineInfo, promise_userFavorites, promise_userTagCloudInfo;
  	  	
    allUserInfo.getUserInfo = function(){
		return (promise_userInfo = generalAPICall(promise_userInfo, "https://api.stackexchange.com/2.2/me?order=desc&sort=reputation&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	};  

    allUserInfo.getUserBadgesInfo = function(){
    	return (promise_userBadgesInfo = generalAPICall(promise_userBadgesInfo, "https://api.stackexchange.com/2.2/me/badges?order=desc&sort=rank&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	};    

    allUserInfo.getUserTimelineInfo = function(){
    	return (promise_userTimelineInfo = generalAPICall(promise_userTimelineInfo, "https://api.stackexchange.com/2.2/me/timeline?site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	};  
    
	allUserInfo.getUserFavorites = function(){
    	return (promise_userFavorites = generalAPICall(promise_userFavorites, "https://api.stackexchange.com/2.2/me/favorites?order=desc&sort=activity&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	}; 
    
	allUserInfo.getUserTagCloudInfo = function(){
    	return (promise_userTagCloudInfo = generalAPICall(promise_userTagCloudInfo, "https://api.stackexchange.com/2.2/me/tags?order=desc&sort=popular&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	};  

	function generalAPICall(promiseData, url){
		if(!promiseData){
			promiseData = $http.jsonp(url).success(function(data){
				return data;
			});	
		}
		console.error("End of the day, this is the cache object: ", promiseData);
		return promiseData;
	}

	return allUserInfo;

}]);