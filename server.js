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
var serviceAccount = require('/Users/teothuirum/Documents/GitHub/RFID_Attendance_WEB/rfidattendencesystemhsu-firebase-adminsdk-ch34r-0b4911bd8f.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://rfidattendencesystemhsu.firebaseio.com'
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
  apiKey: "AIzaSyDST-oSPo3WP-C-F9i_p-vFS7pWQw8WYNA",
  authDomain: "rfidattendencesystemhsu.firebaseapp.com",
  databaseURL: "https://rfidattendencesystemhsu.firebaseio.com",
  projectId: "rfidattendencesystemhsu",
  storageBucket: "rfidattendencesystemhsu.appspot.com",
  messagingSenderId: "1083910663230"
};
firebase.initializeApp(config);

var ref = firebase.database().ref();
//-------------------------------------------------//


//-------------------------------------------------//
//               RDIF Mqtt listeners               //
//-------------------------------------------------//

var MQTT = require("mqtt");

var client = MQTT.connect("tcp://192.168.2.151:1883");

client.on('connect', () => {
  client.subscribe('rfid/attendance/studentID')
  client.subscribe('rfid/attendance/studentIDFeedBack')
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'rfid/attendance/studentID':
      return studentAttendanceRFID1(message)
    case 'rfid/attendance/studentIDFeedBack':
      return studentAttendanceRFID2(message)
  }
  console.log('No handler for topic %s', topic)
})

function studentAttendanceRFID1 (message) {
  console.log('StudentID Received from RFID: %s', message)
}

function studentAttendanceRFID2 (message) {

}
//-------------------------------------------------//


//-------------------------------------------------//
//                 404 Error Page                  //
//-------------------------------------------------//

app.use(function(req, res)
{
  res.sendFile(__dirname + '/public/404.html');
});
