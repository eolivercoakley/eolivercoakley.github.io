/**
 * Created by ecoakley on 8/28/2014.
 */

myApp.factory('globalObject', ['$http', '$cookieStore', function($http, $cookieStore) {
    console.error("Creating the global service");

    var globalObject = {}; //Object to store the access token 
	var locationObject = {}; //Used to store the auth data passed back via location.hash	
	var accessToken;
	var userFavoriteQuestionIDs = [];
	
	//Obtain access data from the url after the authentication data is sent back, but before the page is re-routed.
	(function getDataPassedBackViaLogin(){
		var urlParams = location.hash.substring(location.hash.indexOf('#') + 2).split('&');
		for (var i = 0; i < urlParams.length; i++) {
	    	var pair = urlParams[i].split('=');
	    	locationObject[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  	}
	})();
	
	(function obtainCookieData(){
    	var cookie_access_info = $cookieStore.get("access_token");
    	
    	//If we have already stored the data in a cookie
	    if(cookie_access_info){
	    	accessToken = cookie_access_info;
	    }
    	//If we are loading from the url return data
	    else if(locationObject.access_token){
	    	accessToken = locationObject.access_token;
	    	$cookieStore.put("access_token", accessToken);	   
	    }
	    //If the accessToken has been set, then the user can login. Redirect to the home page.
	    if(accessToken){
	    	console.error(accessToken);
	    	location.href = "#/home";
	    }		
	})();
		
	globalObject.getAccessToken = function(){
		return accessToken;
	};	

	globalObject.addUserFavoriteID = function(favID){
		console.error("attempt to add: ", favID);
		if(userFavoriteQuestionIDs.indexOf(favID) === -1){
			userFavoriteQuestionIDs.push(favID);			
		}
		console.error("After adding id, array is: ", userFavoriteQuestionIDs);
	};	
	
	globalObject.getFavoriteIDArray = function(){
		return userFavoriteQuestionIDs;
	};	
	
	globalObject.addMultipleUserIDs = function(arrayOfIDs){
		arrayOfIDs.forEach(function(val){
			console.error("Loading into the multi-val add array:", val);
			globalObject.addUserFavoriteID(val);
			}
		);
	};

	globalObject.removeUserFavoriteID = function(favID){
		if(userFavoriteQuestionIDs.indexOf(favID) > -1){
			userFavoriteQuestionIDs.splice(userFavoriteQuestionIDs.indexOf(favID), 1);			
		}
	};

    return globalObject;
}]);

myApp.factory('userLoginAuthentication', [ '$http', 'globalObject', function($http, globalObject) {
	console.error("ATTEMPTING LOGIN INIT!");
	
  	var authenticationInfo = {};
	var authentication_cache;
		
	authenticationInfo.authenticate = function(){
        	if(!(globalObject.getAccessToken())){        		
				console.error("Authentication Redirect!");
        		location.href = "https://stackexchange.com/oauth/dialog?client_id=3523&scope=no_expiry,write_access&redirect_uri=http://eolivercoakley.github.io";         		
        	}       	
        };
            
    return authenticationInfo;
}]);


myApp.factory('allUserData', ['$http', 'globalObject',  function($http, globalObject) {
		
	console.error("Building out the user data request...");
  	
  	var allUserInfo = {};	
  	var accessToken = globalObject.getAccessToken() || "(mZUdl3i(U*5(q*jl*SNkw))";
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
    	return (promise_userFavorites = userFavoritesRequest(promise_userFavorites, "https://api.stackexchange.com/2.2/me/favorites?order=desc&sort=activity&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	}; 
    
	allUserInfo.getUserTagCloudInfo = function(){
    	return (promise_userTagCloudInfo = generalAPICall(promise_userTagCloudInfo, "https://api.stackexchange.com/2.2/me/tags?order=desc&sort=popular&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	};  

	function userFavoritesRequest(promiseData, url){
		if(!promiseData){
			promiseData = $http.jsonp(url).success(function(data){
				console.error(data);
				var arrayOfValidFavoriteIDs = [];
				data.items.forEach(function(a){
					arrayOfValidFavoriteIDs.push(a.question_id);
				});
				globalObject.addMultipleUserIDs(arrayOfValidFavoriteIDs);
				console.error(globalObject.getFavoriteIDArray());
				return data;
			});
		}
		console.error("End of the day, this is the cache object: ", promiseData);
		return promiseData;
	}

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

myApp.factory('questionData', ['$http', 'globalObject',  function($http, globalObject) {
	console.error("Creating the Question Model");
	
  	var questionObject = {};	
	var questionID = 11541695;
	var promise_questionInfo;	
	var promise_questionFavorite;
	var lastSearchUrl = "";
	var isFavorite = false;
	
	questionObject.getQuestionAPIData = function(){
    	return (promise_questionInfo = questionAPICall(promise_questionInfo, "https://api.stackexchange.com/2.2/questions/"+ questionID +"?order=desc&filter=!)rCcH9YBU.wsVQxBWq.X&sort=activity&site=stackoverflow&callback=JSON_CALLBACK"));
	};	
		
	questionObject.setQuestionID = function(_questionID){
		questionID = _questionID;
	};
        
	questionObject.getQuestionID = function(){
		return questionID;
	};  
	
	questionObject.setFavoriteQuestion = function(){
		if(!promise_questionFavorite){			
			var url_to_search = "https://api.stackexchange.com/2.2/questions/"+ questionID +"/favorite";			
			promise_questionFavorite = $http({
                    method: "POST",
                    url: url_to_search,
                    data: $.param({
                        id: questionID,
						key:"C8mLfFHVyj1TGEfdDQTEYw((",
						access_token: globalObject.getAccessToken(),
						site:"stackoverflow",
						preview : false
                    }),
                    headers: {
                    	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"                    	
                    }
                }).success(function(data){
				return data;
			}).error(function(data){
				console.error(arguments);
			});
		}
		return promise_questionFavorite;
	};    
      
	function questionAPICall(promiseData, url){
		if(!promiseData || url != lastSearchUrl){			
			lastSearchUrl = url;
			promiseData = $http.jsonp(url).success(function(data){
				console.error(data);
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
