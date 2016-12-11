(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($rootScope, $location, UserService) {

        var vm = this;
        vm.login = login;

        function login(user) {
            if (user) {
                if (user.username == '' || user.password == '') {
                    $('#loginAlert').removeClass('hidden');
                    vm.alert = "Enter credentials to login";
                } else {
                    $('#loginAlert').addClass('hidden');
                    UserService
                        .login(user)
                        .success(function (user) {
                            if (user === '0') {
                                vm.error = "No such user";
                            }
                            else {
                                $location.url("/user/" + user._id);
                            }
                        })
                        .error(function () {
                            vm.error = "No such user";
                        });
                }
            } else {
                $('#loginAlert').removeClass('hidden');
                vm.alert = "Enter credentials to login";
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if (!user || user.username == '' || !user.password || user.password == '') {
                $('#registerAlert').removeClass('hidden');
                vm.alert = 'Please enter the required fields';
            } else if (user.password != user.password2) {
                $('#registerAlert').removeClass('hidden');
                vm.alert = 'Password does not match';
            } else {
                $('#registerAlert').addClass('hidden');
                var userJson = {username: username, password: password};
                UserService
                    .createUser(userJson)
                    .success(function (user) {
                        $rootScope.currentUser = user;
                        $location.url("/user/" + user._id);
                    })
                    .error(function (error) {
                        vm.error = "Cannot create a user";
                    });
            }
        }
    }

    function ProfileController($rootScope, $routeParams, $location, UserService) {
        var vm = this;
        vm.updateProfile = updateProfile;
        vm.getWebsites = getWebsites;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        /*var userId = ($routeParams.uid);*/

        function init() {
            UserService
            /*.findUserById(userId)*/
                .findCurrentUser
                .success(function (user) {
                    if (user != '0') {
                        vm.user = user;
                    }
                })
                .error(function () {
                    vm.error = "No such user";
                });
        }

        init();

        function logout() {
            UserService.logout()
                .success(function () {
                    $location.url("/login");
                })
        }

        function updateProfile() {
            user = vm.user;
            var userId = ($routeParams.uid);
            UserService
                .updateUser(userId, user)
                .success(function (status) {
                    if (status == 200) {
                        $location.url("/user/" + userId);
                    }
                })
                .error(function () {
                    vm.error = "No such user";
                });
        }

        function getWebsites() {
            var userId = ($routeParams.uid);
            $location.url("/user/" + userId + "/website");
        }

        function deleteUser() {
            var userId = ($routeParams.uid);
            UserService
                .deleteUser(userId)
                .success(function (status) {
                    if (status == "OK") {
                        $location.url("/#/login");
                    }
                })
                .error(function () {
                    vm.error = "No such user";
                });


        }
    }

})();