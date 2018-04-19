$scope.signup = function()
{
  $http(
  {
      method: "post",
      url: "/signup",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      data: $.param({"email":$scope.email, "password":$scope.password})
  })
  .success(function(response)
  {
    $scope.login();
  })
  .error(function(response)
  {
    alert(response.error)
  });
};

$scope.login = function()
{
  ref.signInWithEmailAndPassword(
    {
      email    : $scope.email,
      password : sha256_digest($scope.password)
    },
    function(error, authData)
    {
      if (error)
      {
        console.log("Login Failed!", error);
      }
      else
      {
        console.log("Authenticated successfully with payload:", authData);

        $scope.setInstructor(authData.uid);
      }
    });
};

$scope.setInstructor = function(uid)
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
