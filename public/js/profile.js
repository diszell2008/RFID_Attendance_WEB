/*
//  profile.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the javascript for profile.html. It is responsible for
//  changing a user's password.
*/

var profileApp = angular.module("profileApp", ["firebase"]);

profileApp.controller("ProfileController", ["$scope", "$firebaseArray",
function($scope, $firebaseArray)
{
  var ref = new Firebase("https://rfidwemoshsu.firebaseio.com/");
  var authData = ref.getAuth();

  if(authData)
  {
    $scope.logout = function()
    {
      ref.unauth();
      window.location.href = "login.html";
    };

    $scope.changePassword = function()
    {
      if($scope.newPassword == $scope.verificationPassword)
      {
        ref.changePassword(
          {
            "email":authData.password.email,
            "oldPassword":sha256_digest($scope.oldPassword),
            "newPassword":sha256_digest($scope.newPassword)
          },
          function(error)
          {
            if (error)
            {
              switch (error.code)
              {
                case "INVALID_PASSWORD":
                  alert("The specified user account password is incorrect.");
                  break;
                case "INVALID_USER":
                  alert("The specified user account does not exist.");
                  break;
                default:
                  alert("Unable to change password.");
              }
            }
            else
            {
              alert("User password changed successfully!");
              $scope.oldPassword = "";
              $scope.newPassword = "";
              $scope.verificationPassword = "";

              $scope.$apply();
            }
          });
        }
        else
        {
          alert("New passwords do not match.");
        }
      };
    }
    else
    {
      window.location.href = "login.html";
    }
  }]);
