/**
 * Created by ecoakley on 8/28/2014.
 */

myApp.factory('globalObject', ['$http',  function($http) {
    console.error("Creating the global service");

    var globalObject = window.globalObject || {};

    return globalObject;
}]);

myApp.factory('userLoginAuthentication', ['$http',  function($http) {
	console.error("ATTEMPTING LOGIN INIT!");
	
  	var authenticationInfo = {};
	var authentication_cache;
		
	authenticationInfo.authenticate = function(){
        	if(!window.globalObject.access_token){
        		location.href = "https://stackexchange.com/oauth/dialog?client_id=3523&scope=&redirect_uri=http://eolivercoakley.github.io";         		
        	}       	
        };
        
    return authenticationInfo;
}]);


myApp.factory('allUserData', ['$http',  function($http) {
		
	console.error("Building out the user data request...");
  	
  	var allUserInfo = {};	
  	var accessToken = window.globalObject.stackexchange || "(mZUdl3i(U*5(q*jl*SNkw))";
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

myApp.factory('questionData', ['$http',  function($http) {
	console.error("Creating the Question Model");
	
  	var questionObject = {};	
	var questionID = 11541695;
	var promise_questionInfo;	
	var lastSearchUrl = "";
	
	questionObject.getQuestionAPIData = function(){
    	return (promise_questionInfo = questionAPICall(promise_questionInfo, "https://api.stackexchange.com/2.2/questions/"+ questionID +"?order=desc&filter=!)rCcH9YBU.wsVQxBWq.X&sort=activity&site=stackoverflow&callback=JSON_CALLBACK"));
	};	
		
	questionObject.setQuestionID = function(_questionID){
		questionID = _questionID;
	};
        
	questionObject.getQuestionID = function(){
		return questionID;
	};    
      
	function questionAPICall(promiseData, url){
		if(!promiseData || url != lastSearchUrl){			
			lastSearchUrl = url;
			promiseData = $http.jsonp(url).success(function(data){
				return data;
			});	
		}
		console.error("End of the day, this is the cache object: ", promiseData);
		return promiseData;
	}  
        
    return questionObject;
}]);

myApp.factory('searchData', ['$http',  function($http) {
	console.error("Loading Search Model");
	
  	var searchObject = {};	
	
	var searchQuery = 'javascript';
	var promise_searchInfo;
	var lastSearchUrl = "";
		
	searchObject.getSearchAPIData = function(){		
    	return (promise_searchInfo = searchAPICall(promise_searchInfo, "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q=" + searchQuery + "&closed=False&tagged=javascript&site=stackoverflow&callback=JSON_CALLBACK"));
	};
	
	searchObject.setSearchTag = function(_searchQuery){
		searchQuery = _searchQuery;
	};
        
	searchObject.getSearchTag = function(){
		return searchQuery;
	};    
      
	function searchAPICall(promiseData, url){
		if(!promiseData || url != lastSearchUrl){
			console.error("New search!");
			lastSearchUrl = url;
			promiseData = $http.jsonp(url).success(function(data){
				return data;
			});	
		}
		console.error("End of the day, this is the cache object: ", promiseData);
		return promiseData;
	}  
        
    return searchObject;
}]);
