/*
//  registerStudent.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the javascript for registerStudent.html. It is responsible for
//  registering students for the attendance system.
*/

var registerStudentApp = angular.module("registerStudentApp", ["firebase"]);

registerStudentApp.controller("RegisterStudentController", ["$scope", "$firebaseArray",
function($scope, $firebaseArray)
{
  var ref = new Firebase("https://rfidwemoshsu.firebaseio.com/");
  var refStudents = ref.child('Students');
  var authData = ref.getAuth();

  if(authData)
  {
    $scope.logout = function()
    {
      ref.unauth();
      window.location.href = "login.html";
    };

    $scope.registeredStudents = $firebaseArray(refStudents);

    $scope.registerStudent = function()
    {
      var theStudentRef = refStudents.child($scope.studentID);
      theStudentRef.set(
        {
          firstName:$scope.firstName,
          lastName:$scope.lastName
        },
        function(error)
        {
          if (error)
          {
            alert("Unable to register the student.");
          }
          else
          {
            $scope.studentID = ""
            $scope.firstName = ""
            $scope.lastName = ""
          }
        });
    };
  }
  else
  {
    window.location.href = "login.html";
  }
}]);
