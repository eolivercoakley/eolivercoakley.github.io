/**
 * Created by ecoakley on 8/28/2014.
 */


myApp.controller('GlobalController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {  	
}]);

myApp.controller('LoginController', ['userLoginAuthentication', '$scope', '$routeParams', '$http',
  function(userLoginAuthentication, $scope, $routeParams, $http) {  	
  	console.error("In the login Controller");
	$scope.userLoginAuthentication = userLoginAuthentication;
	console.error(userLoginAuthentication);
    
	this.stackExchangeLogin = function(){		
	console.error("userlogin auth:", userLoginAuthentication.authenticate());
		/*userLoginAuthentication.authenticate().success(
			function(data){
				console.error("Attempting to save login data");
				this.loginCredentials = data;
			}.bind(this)
		);*/
	}.bind(this);


}]);


myApp.controller('HomeController', ['allUserData', '$scope', '$routeParams', '$http',
  function(allUserData, $scope, $routeParams, $http) {  	
  		console.error("Home Controller");
  	  	$scope.allUserData = allUserData;
  	  	
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
  	  		},
  	  		
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
  	  	$scope.questionData = questionData;  	  		
}]);


myApp.controller('SearchController', ['searchData', '$scope', '$routeParams', '$http',
  function(searchData, $scope, $routeParams, $http) {  	
  	  	$scope.searchData = searchData;  	  		
}]);
