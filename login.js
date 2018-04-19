function toggleSignIn() {
  if (firebase.auth().currentUser) {
   alert("Sign out")
    firebase.auth().signOut();
    // [END signout]
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('pass').value;
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
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END authwithemail]
  }
}

function handleSignUp() {
  var email = document.getElementById('semail').value;
  var password = document.getElementById('spass').value;

  if (password.length < 6) {
    alert('Password must be 6 characters or more!');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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
  // [END createwithemail]
}
