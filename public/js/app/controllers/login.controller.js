// -- See AppCtrl Comment for usage description -- //
app
    .controller('LoginController', ['$scope', '$state', '$window', '$rootScope', 'LoginService', function($scope, $state, $window, $rootScope, Login) {

        $scope.alias = 'Login Controller';
        if ($rootScope.sessionUser) $scope.sessionUser = true; //console.log(["Session User", "Changing State To Lobby"]);

        $scope.username = $rootScope.username;
        $scope.password = "password";
        $scope.firstName = "First Name";
        $scope.lastName = "Last Name";
        $scope.email = "email@mail.com";

        $scope.userDetails = [{
            username: $scope.username,
            password: $scope.password,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email
        }];

        // Create New User Function
        $scope.createUser = function() {
            // Creating User Details Object to encapsulate user data
            // We're using push to update the scope with new data from
            // the frontend and sending it to Parse.User()
            $scope.userDetails.push({
                username: $scope.username,
                password: $scope.password,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email
            });

            console.log("Passing Parse Test User to Login.JS using data: ", $scope.userDetails);
            return Login.createUser($scope.userDetails);
        };

        // Login Function Using /login Screen Data
        $scope.login = function(username, password) {
            // Creating User Details Object to encapsulate user data
            // We're using push to update the scope with new data from
            // the frontend and sending it to Parse.User()

            return Login.login(username, password);
        };

        $scope.logout = function() {
            return Login.logout(Parse.User.current());
        };

        $scope.createUser = function(username, firstName, lastName, email, password) {
            var user = {};

            user.username = username;
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = password;

            console.log("Running Create With Data", user);

            return Login.createUser(user);
        };

        $scope.facebookLogin = function() {
            Parse.FacebookUtils.logIn("public_profile,user_likes,email,read_friendlists,user_location", {
                success: function(user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                        $rootScope.collectFacebookData(user);
                        console.log(user, "also running FB User Details Save");

                        console.log($rootScope.sessionUser); // Parse User Current Object

                        console.log("User Details Saved");

                        $rootScope.reloadWindow();
                    }
                    else {
                        console.log("User logged in through Facebook!");
                        // Recapture User Data If User Is Already in Parse DB
                        $rootScope.collectFacebookData(user);

                        console.log("THIS IS USER OBJECT", user);

                        $rootScope.reloadWindow();
                    }
                },
                error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                }
            });
        };

      
        // Test Alert button
        $scope.alert = function() {
            console.log("You've hit the Parse Current User alert button");
            console.log(Parse.User.current());
        };

        $scope.makeAdmin = window.techninja.actions.makeAdmin = function() {
            console.log($rootScope.sessionUserName, "is requesting Admin Axx");
            console.log("Here's your Parse.User.current() object:", $rootScope.sessionUser);

            return Login.makeAdmin();
        };

    }]);
// console.log('Finished loading LoginCtrl');