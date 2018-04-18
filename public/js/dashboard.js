/*
//  dashboard.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the javascript for dashboard.html. It is responsible for
//  adding and removing classes and students.
*/

var dashboardApp = angular.module("dashboardApp", ["firebase"]);

dashboardApp.controller("DashboardController", ["$scope", "$firebaseArray", "$filter",
function($scope, $firebaseArray, $filter)
{
  var ref = new Firebase("https://rfidwemoshsu.firebaseio.com/");
  var refClasses = ref.child("Classes");
  var refAllStudents = ref.child("Students");
  var refRoster;
  
  var authData = ref.getAuth();

  $scope.addingClass = false;
  $scope.addingStudent = false;
  $scope.theRoster;

  if (authData)
  {
    var refInstructors = ref.child('Instructors');
    refInstructors.once("value", function(data)
    {
      var theInstructors = data.val();

      angular.forEach(theInstructors, function(value, key)
      {
        if(authData.uid == key)
        {
          $scope.professor = value
        }
      });
    });

    $scope.theClasses = $firebaseArray(refClasses);
    $scope.allStudents = $firebaseArray(refAllStudents);

    $scope.selectClass = function(obj)
    {
      refRoster = refClasses.child(obj.$id).child('Roster');
      $scope.theRoster = $firebaseArray(refRoster);
      $scope.theClassName = obj.className;
    };

    $scope.addStudent = function(theStudent)
    {
      //The default selection returns a value of null
      if(theStudent != null)
      {
        refRoster.child(theStudent.$id).set(
          {
            "firstName":theStudent.firstName,
            "lastName":theStudent.lastName
          });
      }

      $scope.studentSelection = "";
      $scope.addingStudent = false;
    };

    $scope.removeStudent = function(theStudent)
    {
      theRoster.$remove(theStudent);
    };

    $scope.addClass = function()
    {
      var days = "";
      angular.forEach($scope.days, function(value, index)
      {
        days = days + value;
      });

      var theNewClass =
      {
        "CRN":$scope.CRN,
        "room":$scope.building + " " + $scope.roomNumber,
        "className":"CSC" + $scope.courseNumber,
        "days":days,
        "startTime":$filter('date')($scope.startTime, "h:mm a"),
        "endTime":$filter('date')($scope.endTime, "h:mm a"),
        "instructor":$scope.professor
      };

      refClasses.push(theNewClass);

      $scope.addingClass = false;

      $scope.CRN = null;
      $scope.building = null;
      $scope.roomNumber = null;
      $scope.courseNumber = null;
      $scope.days = null;
      $scope.startTime = null;
      $scope.endTime = null;
    };

    $scope.removeClass = function(theClass)
    {
      $scope.theRoster = null;
      $scope.theClasses.$remove(theClass);
    };

    $scope.logout = function()
    {
      ref.unauth();
      window.location.href = 'login.html';
    };
  }
  else
  {
    window.location.href = 'login.html';
  }

}]);
