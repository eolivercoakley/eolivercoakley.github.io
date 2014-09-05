/**
 * Created by ecoakley on 8/28/2014.
 */

var myApp = angular.module('stackExchangeApp', ['ngRoute', 'ngCookies', 'ngSanitize']);

myApp.controller('GlobalController', ['globalObject', '$scope', '$routeParams', '$http', '$location',
  function(globalObject, $scope, $routeParams, $http, $location) {
      $scope.isAuthenticated = globalObject.getAccessToken();
      
      //Allow the global header widget's buttons to navigate to the other subsections.
      $scope.navigation = function(loc){
	      	location.href = "#/" + loc;
      };
      $scope.$location = $location;
}]);

myApp.controller('LoginController', ['globalObject', 'userLoginAuthentication', '$scope', '$routeParams', '$http',
  function(globalObject, userLoginAuthentication, $scope, $routeParams, $http) {  
	$scope.userLoginAuthentication = userLoginAuthentication;
        	
	this.stackExchangeLogin = function(){		
		userLoginAuthentication.authenticate();
	};

	//Auto redirect if login is valid. Shouldn't need this, as navigation won't allow the user to return to login 
	//after authentication, but prevents the user from directly inputting the url.
	if(globalObject.getAccessToken() && location.hash.substring("login") != -1){
		location.href = "#/home";
	}

}]);


myApp.controller('HomeController', ['allUserData', '$scope', '$routeParams', '$http',
  function(allUserData, $scope, $routeParams, $http) {  
  	  	
  	  	//Load all data into respective widgets
  	  	//General User Data
  	  	
  	  	var userDataToLoad = [
  	  		{
				"functionName"	: "getUserInfo",
				"tableValue"	: "userInfo"				
  	  		},
  	  		{
				"functionName"	: "getUserBadgesInfo",
				"tableValue"	: "badgesInfo"				
  	  		},
  	  		{
				"functionName"	: "getUserTimelineInfo",
				"tableValue"	: "timelineInfo"				
  	  		},
  	  		{
				"functionName"	: "getUserFavorites",
				"tableValue"	: "favoritesInfo"				
  	  		},
  	  		{
				"functionName"	: "getUserTagCloudInfo",
				"tableValue"	: "tagCloudInfo"				
  	  		}
  	  		
  		];
  	  	
  	  	//Closure to load all data into their respective widgets
  	  	for(var i in userDataToLoad){
  	  		(function(iter){
		  	  	allUserData[userDataToLoad[iter].functionName]().success(
		  			(function(data){
		  	  			this[userDataToLoad[iter].tableValue] = data.items[0];
		  	  	}.bind(this)));  	  			
  	  		}).bind(this)(i);
  	  	}		
}]);


myApp.controller('QuestionController', ['questionData', '$scope', '$routeParams', '$http',
  function(questionData, $scope, $routeParams, $http) {  	
  	
  	  	//Initial Load
  	  	if(questionData.getQuestionID()){
  	  		questionData.getQuestionAPIData().success(
  	  			function(data){
  	  				this.questionInfo = data.items[0];
  	  				console.error(this.questionInfo);
  	  			}.bind(this)
  	  		);
  	  	};
}]);


myApp.controller('SearchController', ['searchData', 'questionData', '$scope', '$routeParams', '$http',
  function(searchData, questionData, $scope, $routeParams, $http) {  	
  	  	
  	  	  	  	
  	  	//Set the question ID and now load the new page.
  	  	this.loadQuestion = function(questionInfo){
  	  		questionData.setQuestionID(questionInfo);
  	  		location.href = "#/question";
  	  	};
  	  	
  	  	//Get search information from the API when the user submits the form post.
  	  	this.getSearchInfo = function(searchInfo){
  	  		console.error("In search info");
  	  		//Update the search only if the user is requesting a new query.
  	  		if(searchInfo && searchInfo.userInputText){
  	  			searchData.setSearchTag(searchInfo.userInputText);
			}
			//Make the API call and update data upon return
  	  		searchData.getSearchAPIData().success(
  	  			function(data){
  	  				this.searchInfo = data.items;
  	  			}.bind(this)
  	  		);
  	  	};
  	  	
  	  	//Run this request initially to load the default search settings.
  	  	this.getSearchInfo.bind(this)();
}]);
