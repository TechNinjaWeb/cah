// ---- Beta Test Code --- //
// This is test code to integrate Parse into Angular.
// Elements will be reusable in this mannor by allowing us
// to pass ParseServices as a dependency in any of our controllers
app
    .service("LoginService", ['$state', '$rootScope', '$window', function($state, $rootScope, $window) {
        var Login = {};

        Login.createUser = function(userDetails) {

            var user = new Parse.User();

            var userDetailsLength = userDetails.length;

            // console.log("Received Parse Test User Data", "Attempting to Create Parse User");

            // Using Parses user.set() method to set the Users
            // login data before querying the server
            user.set("username", userDetails.username);
            console.log("Setting Parse.User " + userDetails.username);
            user.set("password", userDetails.password);
            console.log("Setting Parse.User " + userDetails.password);
            user.set("firstName", userDetails.firstName);
            console.log("Setting Parse.User " + userDetails.firstName);
            user.set("lastName", userDetails.lastName);
            console.log("Setting Parse.User " + userDetails.lastName);
            user.set("email", userDetails.email);
            console.log("Setting Parse.User " + userDetails.email);

            user.signUp(null, {
                success: function(user) {
                    console.log("Redirecting You To Home State");
                    $state.go('home.login');
                    // $rootScope.reloadWindow();
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });

        };

        Login.login = window.techninja.actions.login = function(username, password) {
            // Capture the length of the array
            // The last item in userDetailsLength array is the
            // most recent data from the user
            // Grab the username & password and send it
            // into a Parse.User.logIn function
            
            
            console.log(["Logging In User "+username]);
            Parse.User.logIn(username || "tom@j.com", password || "wow", {
                success: function(user) {
                    // Do stuff after successful login.
                    $rootScope.Game.username = user.attributes.username;
                    $rootScope.Game.userId = user.id;
                    
                    console.log(["User Signed In"], ['user', user], [$rootScope.Game.username, $rootScope.Game.userId]);
                    $state.reload();
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                    console.log("User Login Failed", error, user);
                }
            });
        };

        Login.logOut = function(sessionUser) {
            console.log("I heard your request to logout")

            if ($rootScope.sessionUser) {
                $rootScope.ParseUser.logOut();
                console.log("User Logged Out");
                $state.go('home.index');
                $rootScope.reloadWindow();
            }
            else {
                console.log("Please Login");
                $state.go('login');
            }
        };

        Login.makeAdmin = function() {
            if ($rootScope.sessionUser && $rootScope.techNinjaAdmin) {
                console.log("Making: " + $rootScope.techNinjaAdminName + " admin");
                console.log("Tech Ninja Admin variable is: ", $rootScope.techNinjaAdmin);
            }
            else {
                console.log("User: " + $rootScope.techNinjaAdminName + " is not an admin");
                console.log("Tech Ninja Admin variable is: ", $rootScope.techNinjaAdmin);
            }
        };

        return Login;

    }]);