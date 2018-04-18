/*
//  login.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the javascript for login.html. It is responsible for
//  authenticating the user.
*/

var loginApp = angular.module("loginApp", ["firebase"]);

loginApp.controller("AuthController", ["$scope", "$firebaseAuth",
function($scope, $firebaseAuth)
{
  var ref = new Firebase("https://rfidwemoshsu.firebaseio.com/");
  var authData = ref.getAuth();

  if(authData)
  {
    window.location.href = 'index.html';
  }

  $scope.login = function()
  {
    ref.authWithPassword(
      {
        email    : $scope.username,
        password : sha256_digest($scope.password)
      },
      function(error, authData)
      {
        if (error)
        {
          alert(error);
        }
        else
        {
          window.location.href = 'dashboard.html'
        }
      });
  };
}]);
