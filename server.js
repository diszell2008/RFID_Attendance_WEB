/*
//  server.js
//  Attendance_Web
//
//  Created by Jake Wert on 5/13/16.
//  Copyright © 2016 Jake Wert. All rights reserved.
//
//  This is the node.js server. It is responsible for
//  serving the html, css, and js which make up the attendance website,
//  responding to API requests, and displaying the 404 page if anything
//  else is requested from the server.
*/

var express = require('express');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var http = require('http');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

http.createServer(app).listen(app.get('port'), function()
{
    console.log('Server running.');
});
//-------------------------------------------------//
//          Firebase Admin Config                  //
//-------------------------------------------------//
var admin = require('firebase-admin');
var serviceAccount = require('/Users/teothuirum/Documents/GitHub/RFID_Attendance_WEB/test-f889d-firebase-adminsdk-6ul13-5ec6644fb0.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-f889d.firebaseio.com'
});
//-------------------------------------------------//
//                  Static Files                   //
//-------------------------------------------------//

app.use(express.static(__dirname + '/public'));

//-------------------------------------------------//
//                Account Creation                 //
//-------------------------------------------------//

// Initialize Firebase
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
//-------------------------------------------------//


//-------------------------------------------------//
//               RDIF Mqtt listeners               //
//-------------------------------------------------//

var MQTT = require("async-mqtt");

var client = MQTT.connect("tcp://somehost.com:1883");

// WHen passing async functions as event listeners, make sure to have a try catch block
client.on("connect", doStuff);
async function doStuff() {

	console.log("Starting");
	try {
		await client.publish("rfid/attendance/web", "It works!");
		// This line doesn't run until the server responds to the publish
		await client.end();
		// This line doesn't run until the client has disconnected without error
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}
//-------------------------------------------------//


app.post('/signup', function(req, res)
{
  var refApprovedFaculty = ref.child('ApprovedFaculty');
  refApprovedFaculty.once('value', function (dataSnapshot)
  {
    var approvedFaculty = dataSnapshot.val();
    var approvedFacultyKeys = Object.keys(approvedFaculty);
    var approved = false;

    for (var i = 0; i < approvedFacultyKeys.length; i++)
    {
      var key = approvedFacultyKeys[i];
      var approvedEmail = String(approvedFaculty[key].toLowerCase());
      var requestEmail = String(req.body.email.toLowerCase())

      if(approvedEmail == requestEmail)
      {
        approved = true;
        break;
      }
    }

    if(approved)
    {
      ref.createUserWithEmailAndPassword(
      {
        email    : req.body.email,
        password : req.body.password
      },
      function(error, userData)
      {
        if (error)
        {
          var errorDescription;
          switch (error.code)
          {
            case "EMAIL_TAKEN":
              errorDescription = "The new user account cannot be created because the email is already in use.";
              break;
            case "INVALID_EMAIL":
              errorDescription = "The specified email is not a valid email.";
              break;
            default:
              errorDescription = "Error creating user."
          }

          res.status(500);
          res.send({error:errorDescription});
        }
        else
        {
          res.status(200);
          res.send(userData);
        }
      });
    }
    else
    {
      res.status(500);
      res.send({error:'Only approved faculty emails may register.'});
    }
  });
});

//-------------------------------------------------//
//                   API Routes                    //
//-------------------------------------------------//

var apiRouter = express.Router();

// Register the API prefix
app.use('/api' , apiRouter);

// Manager of all API Requests
apiRouter.use(function(req, res, next)
{
    console.log('API Request');
    next();
});

apiRouter.route('/attendance')
    .get(function(req, res)
    {
      var theClassesRef = ref.child('Classes');
      var allClasses;
      var theAttendance = [];

      theClassesRef.once('value', function (dataSnapshot)
      {
        allClasses = dataSnapshot.val();

        Object.keys(allClasses).forEach(function(key)
        {
          theAttendance.push({ className:allClasses[key].className, attendance:allClasses[key].Attendance });
        });

        res.json(theAttendance);
      }, function (err)
      {
        res.send(err);
      });
    });

apiRouter.route('/attendance/className/:class_name')
    .get(function(req, res)
    {
      var theClassesRef = ref.child('Classes');
      var allClasses;
      var theAttendance = [];

      theClassesRef.once('value', function (dataSnapshot)
      {
        allClasses = dataSnapshot.val();

        Object.keys(allClasses).forEach(function(key)
        {
          if(allClasses[key].className == req.params.class_name)
          {
            theAttendance.push({ className:allClasses[key].className, attendance:allClasses[key].Attendance });
          }
        });

        res.json(theAttendance);
      }, function (err)
      {
        res.send(err);
      });
    });

  apiRouter.route('/attendance/className/:class_name/date/:date')
      .get(function(req, res)
      {
        var theClassesRef = ref.child('Classes');
        var allClasses;
        var allClassesKeys = [];
        var theClass;
        var attendanceDates;
        var theAttendance = {};

        theClassesRef.once('value', function (dataSnapshot)
        {
          allClasses = dataSnapshot.val();
          allClassesKeys = Object.keys(allClasses);

          for (var i = 0; i < allClassesKeys.length; i++)
          {
            var key = allClassesKeys[i];
            if(allClasses[key].className == req.params.class_name)
            {
              theClass = allClasses[key];
              break;
            }
          }

          try
          {
            attendanceDates = Object.keys(theClass.Attendance);

            for (var i = 0; i < attendanceDates.length; i++)
            {
              var date = attendanceDates[i];
              if(date == req.params.date)
              {
                theAttendance = theClass.Attendance[date];
              }
            }
          }
          catch(e)
          {
            //There is no attendance, return default value of {}
          }

          res.json(theAttendance);

        }, function (err)
        {
          res.send(err);
        });
      });

apiRouter.route('/attendance/instructor/:first_name/:last_name')
    .get(function(req, res)
    {
      var theClassesRef = ref.child('Classes');
      var allClasses;
      var theAttendance = [];

      theClassesRef.once('value', function (dataSnapshot)
      {
        allClasses = dataSnapshot.val();

        Object.keys(allClasses).forEach(function(key)
        {
          if( (allClasses[key].instructor.firstName == req.params.first_name) && (allClasses[key].instructor.lastName == req.params.last_name) )
          {
            theAttendance.push({ className:allClasses[key].className, attendance:allClasses[key].Attendance });
          }
        });

        res.json(theAttendance);
      },
      function (err)
      {
        res.send(err);
      });
    });

apiRouter.route('/attendance/student/:first_name/:last_name')
    .get(function(req, res)
    {
      var theClassesRef = ref.child('Classes');
      var allClasses;
      var studentClasses = [];

      theClassesRef.once('value', function (dataSnapshot)
      {
        allClasses = dataSnapshot.val();

        Object.keys(allClasses).forEach(function(key)
        {
          var theClass = allClasses[key];
          var theRoster = theClass.Roster;

          try
          {
            var rosterKeys = Object.keys(theRoster);
            for (var i = 0; i < rosterKeys.length; i++)
            {
              var key = rosterKeys[i];
              var theStudent = theRoster[key];
              if( (theStudent.firstName == req.params.first_name) && (theStudent.lastName == req.params.last_name) )
              {
                studentClasses.push({ className:theClass.className, attendance:theClass.Attendance });
                break;
              }
            }
          }
          catch(err)
          {
            //The Class has no roster so we shouldn't even look for a student here
          }

        });

        res.json(studentClasses);

      }, function (err)
      {
        res.send(err);
      });
    });

apiRouter.route('/student')
    .get(function(req, res)
    {
      var theStudentsRef = ref.child('Students');

      theStudentsRef.once('value', function (dataSnapshot)
      {
        res.json(dataSnapshot.val());
      },
      function (err)
      {
        res.send(err);
      });
    });

apiRouter.route('/roster')
    .get(function(req, res)
    {
      var theClassesRef = ref.child('Classes');
      var allClasses;
      var theRosters = [];

      theClassesRef.once('value', function (dataSnapshot)
      {
        allClasses = dataSnapshot.val();

        Object.keys(allClasses).forEach(function(key)
        {
          theRosters.push({ className:allClasses[key].className, roster:allClasses[key].Roster });
        });

        res.json(theRosters);
      }, function (err)
      {
        res.send(err);
      });
    });

apiRouter.route('/roster/className/:class_name')
    .get(function(req, res)
    {
      var theClassesRef = ref.child('Classes');
      var allClasses;
      var theRosters = [];

      theClassesRef.once('value', function (dataSnapshot)
      {
        allClasses = dataSnapshot.val();

        Object.keys(allClasses).forEach(function(key)
        {
          if(allClasses[key].className == req.params.class_name)
          {
            theRosters.push(allClasses[key].Roster);
          }
        });
        res.json(theRosters);
      },
      function (err)
      {
        res.send(err);
      });
    });

//-------------------------------------------------//
//                 404 Error Page                  //
//-------------------------------------------------//

app.use(function(req, res)
{
  res.sendFile(__dirname + '/public/404.html');
});
