/**
 * Created by ecoakley on 8/28/2014.
 */

myApp.factory('globalObject', ['$http', '$cookieStore', function($http, $cookieStore) {

    var globalObject = {}; //Object to store the access token 
	var locationObject = {}; //Used to store the auth data passed back via location.hash	
	var accessToken = "9UOfQK7ZNY6XbiyYS97S3Q))"; //debug for now @TODO - REMOVE THIS
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

	})();
		
	globalObject.getAccessToken = function(){
		return accessToken;
	};	

	globalObject.addUserFavoriteID = function(favID){
		if(userFavoriteQuestionIDs.indexOf(favID) === -1){
			userFavoriteQuestionIDs.push(favID);			
		}
	};
	
	globalObject.getFavoriteIDArray = function(){
		return userFavoriteQuestionIDs;
	};	
	
	globalObject.isQuestionFavorite = function(questionID){
		if(userFavoriteQuestionIDs.indexOf(questionID) === -1){
			return false;
		}
		else{
			return true;
		}
	};
	
	globalObject.addMultipleUserIDs = function(arrayOfIDs){
		arrayOfIDs.forEach(function(val){
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
	
  	var authenticationInfo = {};
	var authentication_cache;
		
	authenticationInfo.authenticate = function(){
        	if(!(globalObject.getAccessToken())){
        		location.href = "https://stackexchange.com/oauth/dialog?client_id=3523&scope=no_expiry,write_access&redirect_uri=http://eolivercoakley.github.io";         		
        	}       	
        };
            
    return authenticationInfo;
}]);


myApp.factory('allUserData', ['$http', 'globalObject',  function($http, globalObject) {
  	
  	var allUserInfo = {};	
  	var accessToken = globalObject.getAccessToken();
  	var promise_userInfo, promise_userBadgesInfo, promise_userTimelineInfo, promise_userFavorites, promise_userTagCloudInfo;
  	  	
    allUserInfo.getUserInfo = function(){
		return (promise_userInfo = generalAPICall(promise_userInfo, "https://api.stackexchange.com/2.2/me?order=desc&sort=reputation&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&callback=JSON_CALLBACK"));
	};  

    allUserInfo.getUserBadgesInfo = function(){
    	return (promise_userBadgesInfo = generalAPICall(promise_userBadgesInfo, "https://api.stackexchange.com/2.2/me/badges?order=desc&sort=rank&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((&access_token=" + accessToken + "&filter=!9YdnSNoYZ&callback=JSON_CALLBACK"));
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
				var arrayOfValidFavoriteIDs = [];
				data.items.forEach(function(a){
					arrayOfValidFavoriteIDs.push(a.question_id);
				});
				globalObject.addMultipleUserIDs(arrayOfValidFavoriteIDs);
				return data;
			});
		}
		return promiseData;
	}

	function generalAPICall(promiseData, url){
		if(!promiseData){
			promiseData = $http.jsonp(url).success(function(data){
                return data;
			});	
		}
		return promiseData;
	}

	return allUserInfo;

}]);

myApp.factory('questionData', ['$http', 'globalObject',  function($http, globalObject) {
  	var questionObject = {};
	var questionID = null;//11541695;
	var promise_questionInfo;	
	var lastSearchUrl = "";
	var isFavorite = false;
    var _tmpAccessToken = globalObject.getAccessToken();
    var access_token = _tmpAccessToken ? "&access_token=" + _tmpAccessToken : "";

	questionObject.getQuestionAPIData = function(){
    	return (promise_questionInfo = questionAPICall(promise_questionInfo, "https://api.stackexchange.com/2.2/questions/"+ questionID +"?order=desc&filter=!)rCcH9YBU.wsVQxBWq.X&sort=activity&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((" + access_token + "&callback=JSON_CALLBACK"));
	};	
		
	questionObject.setQuestionID = function(_questionID){
		questionID = _questionID;
	};
        
	questionObject.getQuestionID = function(){
		return questionID;
	};  
	
	questionObject.toggleFavoriteQuestion = function(){
		var isFavorited = "";
		
		globalObject.isQuestionFavorite(questionID) ? isFavorited = "/undo" : "";
		
		var url_to_search = "https://api.stackexchange.com/2.2/questions/"+ questionID +"/favorite" + isFavorited;			
		return promise_questionFavorite = $http({
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
            	if(isFavorited === ""){
            		globalObject.addUserFavoriteID(questionID);            		
            	}
            	else{
            		globalObject.removeUserFavoriteID(questionID);            		
            	}
			return data;
		}).error(function(data){
		});
	};
      
	function questionAPICall(promiseData, url){
		if(!promiseData || url != lastSearchUrl){			
			lastSearchUrl = url;
			promiseData = $http.jsonp(url).success(function(data){
				return data;
			});
		}
		return promiseData;
	}  
        
    return questionObject;
}]);

myApp.factory('searchData', ['$http', 'globalObject', function($http, globalObject) {
  	var searchObject = {};
	var searchQuery = 'javascript';
	var promise_searchInfo;
	var lastSearchUrl = "";
    var _tmpAccessToken = globalObject.getAccessToken();
	var access_token = _tmpAccessToken ? "&access_token=" + _tmpAccessToken : "";

	searchObject.getSearchAPIData = function(){		
    	return (promise_searchInfo = searchAPICall(promise_searchInfo, "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q=" + searchQuery + "&closed=False&tagged=javascript&site=stackoverflow&key=C8mLfFHVyj1TGEfdDQTEYw((" + access_token + "&callback=JSON_CALLBACK"));
	};
	
	searchObject.setSearchTag = function(_searchQuery){
		searchQuery = _searchQuery;
	};
        
	searchObject.getSearchTag = function(){
		return searchQuery;
	};    
      
	function searchAPICall(promiseData, url){
		if(!promiseData || url != lastSearchUrl){
			lastSearchUrl = url;
			promiseData = $http.jsonp(url).success(function(data){
				return data;
			});	
		}
		return promiseData;
	}  
        
    return searchObject;
}]);
