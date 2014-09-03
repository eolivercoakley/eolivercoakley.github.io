/**
 * Created by ecoakley on 8/28/2014.
 */


myApp.controller('GlobalController', ['globalObject', '$scope', '$routeParams', '$http',
  function(globalObject, $scope, $routeParams, $http) {
      $scope.isAuthenticated = globalObject.access_token;
}]);

myApp.controller('LoginController', ['userLoginAuthentication', '$scope', '$routeParams', '$http',
  function(userLoginAuthentication, $scope, $routeParams, $http) {  
	$scope.userLoginAuthentication = userLoginAuthentication;
        	
	this.stackExchangeLogin = function(){		
		userLoginAuthentication.authenticate();
	};

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
  	  				this.questionInfo = data.items;
  	  				console.error(data);
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
