/*
//  signup.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the javascript for signup.html. It is responsible for
//  signing a professor up, authenticating them, and creating an
//  instructor record for them in Firebase.
*/
var signupApp = angular.module("signupApp", ["firebase"]);

signupApp.controller("SignUpController", ["$scope", "$firebaseAuth", "$http",
function($scope, $firebaseAuth, $http)
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
  var auth = $firebaseAuth();

  $scope.signup = function() {
    var email = $scope.email;
    var password = $scope.password;

    // Create User with email and pass.
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(firebaseUser) {
      // setInstructor with UID
      firebase.auth().onAuthStateChanged(function(user){
        if (user)
        {
          $scope.setInstructor(user.uid);
        }
        else
        {
          // Bla Bla
        }
      });
        // Switching To Dashboard
        window.location.href = 'dashboard.html';
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
  }

  $scope.login = function() {
    if (authData) {
     alert("Sign out")
      firebase.auth().signOut();
      // [END signout]
    } else {
      var email = $scope.username;
      var password = $scope.password;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email,password)
         .then(function(firebaseUser) {
             // Success
             window.location.href = 'dashboard.html'
             console.log("Authenticated successfully with payload:", authData);
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
  };

  $scope.setInstructor = function(userUID)
  {
    var ref = firebase.database().ref();
    var refInstructors = ref.child('Instructors');

    var theInstructorsRef = refInstructors.child(userUID);
    theInstructorsRef.set(
      {
        firstName:$scope.firstName,
        lastName:$scope.lastName
      },
      function(error)
      {
        if (error)
        {
          alert("Unable to complete account creation. Please have the admin remove your account before trying again.");
        }
        else
        {
          window.location.href = 'dashboard.html';

        }
      });
  };

  $scope.setInstructorold = function(uid)
  {
    var instructorRef = ref.child("Instructors").child(uid);

    instructorRef.set(
    {
      firstName: $scope.firstName,
      lastName: $scope.lastName
    },
    function(error)
    {
      if (error)
      {
        alert("Unable to complete account creation. Please have the admin remove your account before trying again.");
      }
      else
      {
        window.location.href = 'dashboard.html';
      }
    });
  };
}]);
