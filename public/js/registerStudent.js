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
  var config = {
    apiKey: "AIzaSyA-i--1XoCEk6hsJwb8acETuL6fNQlsPJY",
    authDomain: "test-f889d.firebaseapp.com",
    databaseURL: "https://test-f889d.firebaseio.com",
    projectId: "test-f889d",
    storageBucket: "test-f889d.appspot.com",
    messagingSenderId: "41107007188"
  };
  firebase.initializeApp(config);

  var ref = firebase.database().ref();
  var refStudents = ref.child('Students');
  var authData = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged(function(user) {
    if(user)
    {
      $scope.logout = function()
      {
        firebase.auth().signOut()
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
  });
}]);
