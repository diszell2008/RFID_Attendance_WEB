/*
//  index.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the javascript for index.html. It is responsible for
//  displaying attendance.
*/

var indexApp = angular.module("indexApp", ["firebase"]);

indexApp.controller("AttendanceController", ["$scope", "$firebaseArray",
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
  var refClasses = ref.child('Classes');
  var refClassDates;
  var refDate;

  var authData = firebase.auth().currentUser;

  $scope.classes = $firebaseArray(refClasses);
  $scope.theRoster;

  //Authentication isn't required for index.html, but it changes the appearance of the Navbar
  //Logout is shown if authenticated. Login and Sign Up are shown if not.

  firebase.auth().onAuthStateChanged(function(user) {
    if(user)
    {
      $scope.authenticated = true;
    }
    else
    {
      $scope.authenticated = false;
    }
  });


  $scope.selectClass = function(obj)
  {
    $scope.theClassName = obj.className;
    $scope.selectedDate = null;
    $scope.theAttendance = null;

    var refClass = refClasses.child(obj.$id);
    refClassDates = refClass.child("Attendance");
    $scope.classDates = $firebaseArray(refClassDates);
    $scope.theRoster = $firebaseArray(refClass.child('Roster'));
  };

  $scope.displayAttendance = function(dateSelection)
  {
    refDate = refClassDates.child(dateSelection.$id);
    $scope.theAttendance = $firebaseArray(refDate);
  };

  $scope.logout = function()
  {
    firebase.auth().signOut()
    window.location.reload();
  };
}]);
