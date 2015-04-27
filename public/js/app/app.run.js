app.run(function($rootScope, $timeout){
	// console.log('Parse bootstrap complete');

        // console.log('Initializing FBLogin ...');

        window.fbAsyncInit = function() {
            console.log('FB Init has been called');
            Parse.FacebookUtils.init({ // this line replaces FB.init({
                appId: '710919952311309',
                xfbml: true,
                version: 'v2.2'
            });

            // Run code after the Facebook SDK is loaded.
            // Run check to see if current user is Admin
            // $rootScope.checkAdmin();

            $rootScope.facebookLogin = function() {

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
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        $rootScope.createRoles = function() {
            // Instantiate Parse Role Authentication Object
            var accountRole = new Parse.ACL();
            // Set this role to have Public Read Axx
            accountRole.setPublicReadAccess(true);
            // Set specific axx rules for individual roles
            accountRole.setRoleWriteAccess("Admin", true);
            // console.log("admin role write access has been set");
            
            // console.log("Heres what the accountRole object looks like:", accountRole);
            // Define and Instantiate the Roles, and
            // pass the ACL Instance into each Parse.Role(RoleName, ACL);
            var userRole = new Parse.Role("User", accountRole);
            var adminRole = new Parse.Role("Admin", accountRole);
            // Set Up Role Objects and Parameters
            var RoleObject = Parse.Object.extend('_Role');
            // Set Query for User Role
            var userRoleQuery = new Parse.Query(RoleObject);
            // Set Query for Admin Role
            var adminRoleQuery = new Parse.Query(RoleObject);
            // Set Main Query Object
            var queryRoleObject = new Parse.Query.or(userRoleQuery, adminRoleQuery);
            // Define the User Role Query
            userRoleQuery.equalTo("name", "User");
            // Define the Admin Role Query
            adminRoleQuery.equalTo("name", "Admin");
            
            // Create Object for individual Role Save Functions
            var saveUsers = {
                user: function() {
                    console.log(saveUsers);
                    // Save User Role
                    userRole.save(null, {
                        success: function(userRole) {
                            // var userRoleString = JSON.stringify(userRole, null, 4);
                            // console.log('userRoleString Object output a string: ', userRoleString);
                            console.log('Successfully saved ', userRole);
                        },
                        error: function(userRole, err) {
                            var userRoleString = JSON.stringify(userRole, null, 4);
                            console.log('userRoleString Object output a string: ', userRoleString);
                            console.log("This Object created an Error ", userRole);
                            console.log("It's Error is ", err);
                            console.log("The Errors name is ", err.name);
                        }
                    }).then(function(userRole, err) {
                        console.log("Testing Chained Functions", "Nothing to See Here ...");
                    });
                    console.log("User Role Saved");
                },
                admin: function() {
                    // Save Admin Role
                    adminRole.save(null, {
                        success: function(adminRole) {
                            // var adminRoleString = JSON.stringify(adminRole, null, 4);
                            // console.log('adminRoleString Object output a string: ', adminRoleString);
                            console.log('Successfully saved ', adminRole);
                        },
                        error: function(adminRole, err) {
                            var adminRoleString = JSON.stringify(adminRole, null, 4);
                            console.log('adminRoleString Object output a string: ', adminRoleString);
                            console.log("This Object created an Error ", adminRole);
                            console.log("It's Error is ", err);
                            console.log("The Errors name is ", err.name);
                        }
                    });
                    console.log("Admin Role Saved");
                }
            };
            
            // Run the Query and return the results
            queryRoleObject.find({
                success: function(results) {
                    var user = false;
                    var admin = false;
                    console.log("Successfully retrieved " + results.length + " Roles In Database.");
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        
                        var name = object.get('name');
                        var id = object.id;
                        var date = object.updatedAt;
                        
                        console.log("Found Row in Database: ", { 'name': name }, { 'id': id }, { 'date': date });
                        
                        // Set the value true if an expected Role exists
                        if (name === "Admin") {
                            admin = true;
                        } else if (name === "User") {
                            user = true;
                        }
                    }
                    if (results.length == 0) {
                        // Save the Role Data Here
                        // This will only have to be called once ever
                        saveUsers.user();
                        saveUsers.admin();
                        console.log("Role Data Has Been Created and Saved");
                    }else if (results.length != 0 && results.length <=1){
                        console.log("Results are here, but are not greater than 1");
                        console.log("Admin Role present, ", admin);
                        console.log("User Role present, ", user);
                        if (!admin) {
                            saveUsers.admin();
                        } else if (!user) {
                            saveUsers.user();
                        }
                    } else {
                        console.log("No Role Data To Be Saved as a Result of this Find in the Database");
                        console.log("Moving along as planned ...");
                    }
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };

        $rootScope.checkAdmin = function() {
            console.log("Checking Admin Credentials");
            // FB ID of Administrator
            var techNinjaAdminID = "587154828096319";
            // Extend the _User Class Object
            // var UserClass = Parse.Object.extend("User");
            // Create a Query using the User Class Variable
            var query = new Parse.Query("User");
            query.equalTo("username", "Ray");

            if ($rootScope.sessionUserName === "Ray" || true) { // Temporary Admin Status Set
                query.find({
                    success: function(results) {
                        console.log("Successfully retrieved " + results.length + " Admin Username.");
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            // console.log("Testing AuthData Raw Object Info", object.get('authData'));

                            // Get The authData object and convert it into a JSON String
                            var fbAuthDataString = JSON.stringify(object.get('authData'));
                            // Convert the Stringified Object into a JSON object
                            var fbAuthDataObject = JSON.parse(fbAuthDataString);

                            // Console Log the Two Strings to Compare
                            // console.log("This is the parsed fbAuthDataObject:", fbAuthDataObject.facebook.id, "This is the techNinjaAdminID:", techNinjaAdminID);

                            if (fbAuthDataObject.facebook.id === techNinjaAdminID) {
                                console.log($rootScope.techNinjaAdminName + " is the True Admin, We matched your facebook authId with our Records");
                            }
                            else if (fbAuthDataObject.facebook.id === null || fbAuthDataObject.facebook.id === "") {
                                console.log("Facebook AuthData Empty or Null");
                            }
                            else {
                                console.log("This is not an admin user");
                            }
                        }
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
            else {
                console.log("Hey! You're Not Phree Lyfe.", "... Treating You like the filth you are");
            }
        };

        $rootScope.reloadWindow = function() {
            $timeout(function() {
                console.log('Window Reloaded');
                $window.location.reload();
            }, 200);
            console.log('Invoking Timeout Instead');
        };

        //@ FACEBOOK DATA SAVE  @////////////////////////////////
        $rootScope.collectFacebookData = function(user) {
            console.log("Capturing User Data from Facebook");

            // Set Facebook User Data and Save It To Parse
            FB.api('/me', function(response) {
                var object = response;
                console.log('Your name is ' + object.name);
                user.set("username", object.name);
                user.set("firstName", object.first_name);
                user.set("lastName", object.last_name);
                user.set("email", object.email);
                user.save();
            });

            FB.api('/me/picture', {
                "type": "normal"
            }, function(response) {
                var object = response;
                console.log("profile Pic Located at: " + object.data.url);
                user.set("profilePic", object.data.url);
                user.save();
            });

        };

        // console.log('Finished Initializing FBLogin');

        // Define and Extend the Basic Parse User
        var User = Parse.User.extend({});
        // Create a $rootScope shortcut
        $rootScope.ParseUser = User;
        // Loading Parse.User.current() into rootScope
        $rootScope.sessionUser = Parse.User.current();
        console.log(["$session user", $rootScope.sessionUser]);
        // $rootScope.username = 'Max Payne';

        if ($rootScope.sessionUser) {
            $rootScope.sessionUserName = Parse.User.current().get('username');

            console.log("sessionUser Logged In has triggered attempted to Create Roles");
            $rootScope.createRoles();

        }

        // Get Username and load it into a variable
        if ($rootScope.sessionUser) {
            
            $rootScope.username = Parse.User.current().get('username');
            $rootScope.sessionUserId = $rootScope.userId = $rootScope.sessionUser.id;
            
            console.log("Current Username Is: " + $rootScope.currentUsername+ " and your ID is: "+$rootScope.sessionUserId);
        }

        // Check For Administrator Account
        // and set it to Admin
        if ($rootScope.currentUsername == "Phree Lyfe") {
            $rootScope.techNinjaAdminName = $rootScope.currentUsername;
            console.log("This will make " + $rootScope.techNinjaAdminName + " an Admin. Function coming soon!");
            
            $rootScope.techNinjaAdmin = true;
            console.log("techNinjaAdmin variable set to True");
        }else {
            $rootScope.techNinjaAdmin = false;
            console.log("techNinjaAdmin variable set to False");
        }
        
        // Declare Database Model Variables
        var ParseUserClass = Parse.Object.extend("User");
     
        
       
});
