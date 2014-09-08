/**
 * Created by ecoakley on 8/28/2014.
 */

var myApp = angular.module('stackExchangeApp', ['ngRoute', 'ngCookies', 'ngSanitize']);

myApp.controller('GlobalController', ['globalObject', 'questionData', 'allUserData', '$scope', '$routeParams', '$http', '$location', '$sce',
  function(globalObject, questionData, allUserData, $scope, $routeParams, $http, $location, $sce) {
      $scope.isAuthenticated = globalObject.getAccessToken();
      
      //Allow the global header widget's buttons to navigate to the other subsections.
      $scope.navigation = function(loc){
	      	location.href = "#/" + loc;
      };
      $scope.$location = $location;

      $scope.breadCrumbList = {
          "/Login" : ["Login"],
          "/Question" : ["Home", "Search", "Question"],
          "/Home" : ["Home"],
          "/Search" : ["Home", "Search"]
      }

      $scope.currentLocation = $scope.breadCrumbList[$location];

      $scope.validateSnippet = function(snippet) {
          return $sce.trustAsHtml(snippet);
      };

      //Set the question ID and now load the new page.
      $scope.loadQuestion = function(questionInfo){
          questionData.setQuestionID(questionInfo);
          location.href = "#/Question";
      };

      //Get favorites data for the user if they are authenticated:
      if(globalObject.getAccessToken()){
          allUserData.getUserFavorites();
      }
}]);

myApp.controller('LoginController', ['globalObject', 'userLoginAuthentication', '$scope', '$routeParams', '$http',
  function(globalObject, userLoginAuthentication, $scope, $routeParams, $http) {  
	$scope.userLoginAuthentication = userLoginAuthentication;
        	
	this.stackExchangeLogin = function(){		
		userLoginAuthentication.authenticate();
	};

	//Auto redirect if login is valid.
	if(globalObject.getAccessToken() && location.hash.substring("Login") != -1){
		location.href = "#/Home";
	}

}]);


myApp.controller('HomeController', ['globalObject', 'searchData', 'allUserData', '$scope', '$routeParams', '$http',
  function(globalObject, searchData, allUserData, $scope, $routeParams, $http) {

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


      //Auto redirect if login is valid. Shouldn't need this, as navigation won't allow the user to return to login
      //after authentication, but prevents the user from directly inputting the url.
      if(!globalObject.getAccessToken()){
          location.href = "#/Login"
          this.displayScreen = false;
      }
      else{
          //Closure to load all data into their respective widgets
          for(var i in userDataToLoad){
              (function(iter){
                  allUserData[userDataToLoad[iter].functionName]().success(
                      (function(data){
                          this.displayScreen = true;
                          this[userDataToLoad[iter].tableValue] = data.items;
                          if(userDataToLoad[iter].tableValue == "tagCloudInfo"){
                              setTimeout(function() {
                                  $('#tagging a').tagcloud();
                              },1000);
                          }
                      }.bind(this)));
              }).bind(this)(i);
          }
      }

      this.setSearchQuery = function(query){
          searchData.setSearchTag(query);
          location.href = "#/Search";
      };

}]);


myApp.controller('QuestionController', ['globalObject', 'questionData', '$scope', '$routeParams', '$http',
  function(globalObject, questionData, $scope, $routeParams, $http) {  	
  	
  	  	//Initial Load
  	  	if(questionData.getQuestionID()){
  	  		questionData.getQuestionAPIData().success(
  	  			function(data){
                    if(data && data.items && data.items[0]){
                        this.questionInfo = data.items[0];
                        this.displayScreen = true;
                    }
                    else{
                        this.displayScreen = false;
                    }
  	  			}.bind(this)
  	  		);
  	  	};  	  	
  	  	
  	  	this.setFavorite = function(){
  	  		questionData.toggleFavoriteQuestion().success(
  	  			function(data){
  	  				this.favoriteInfo = data;
  	  				this.isFavorite = globalObject.isQuestionFavorite(questionData.getQuestionID());
  	  			}.bind(this)
  	  		);
  	  	};

      this.isFavorite = globalObject.isQuestionFavorite(questionData.getQuestionID());
      this.isAbleToFavorite = globalObject.getAccessToken();

}]);


myApp.controller('SearchController', ['searchData', 'questionData', '$scope', '$routeParams', '$http',
  function(searchData, questionData, $scope, $routeParams, $http) {

  	  	  	  	

  	  	
  	  	//Get search information from the API when the user submits the form post.
  	  	this.getSearchInfo = function(searchInfo){
  	  		//Update the search only if the user is requesting a new query.
  	  		if(searchInfo && searchInfo.userInputText){
  	  			searchData.setSearchTag(searchInfo.userInputText);
			}
			//Make the API call and update data upon return
  	  		searchData.getSearchAPIData().success(
  	  			function(data){
  	  				this.searchInfo = data.items;
                    setTimeout(function() {
                        $('#tagging a').tagcloud();
                    },1000);
  	  			}.bind(this)
  	  		);
  	  	};

        $scope.sortOrder = 'creation_date';
		$scope.reverse = true;
  	  	//Run this request initially to load the default search settings.
  	  	this.getSearchInfo.bind(this)();
}]);
