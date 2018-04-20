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
  var config = {
    apiKey: "AIzaSyDST-oSPo3WP-C-F9i_p-vFS7pWQw8WYNA",
    authDomain: "rfidattendencesystemhsu.firebaseapp.com",
    databaseURL: "https://rfidattendencesystemhsu.firebaseio.com",
    projectId: "rfidattendencesystemhsu",
    storageBucket: "rfidattendencesystemhsu.appspot.com",
    messagingSenderId: "1083910663230"
  };
  firebase.initializeApp(config);

  var ref = firebase.database().ref();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location.href = 'index.html';
    } else {
      // No user is signed in.
    }
  });

  $scope.login = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
       alert("Sign in Success")
        //firebase.auth().signOut();
        // [END signout]
      } else {
        var email = $scope.username;
        var password = $scope.password;

        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email,password)
           .then(function(firebaseUser) {
               // Success
               window.location.href = 'dashboard.html'
           })
          .catch(function(error) {
               // Error Handling
               var errorCode = error.code;
               var errorMessage = error.message;
               if (errorCode === 'auth/wrong-password') {
                 alert('Wrong password.');
               } else {
                 alert(errorMessage);
               }
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
    });
  };
}]);
