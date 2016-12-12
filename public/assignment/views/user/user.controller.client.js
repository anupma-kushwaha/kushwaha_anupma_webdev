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
                if (user.username == '' || user.password == '' || user.password == undefined || user.username == undefined) {
                    $('#loginAlert').removeClass('hidden');
                    vm.alert = "Enter credentials to login";
                } else {
                    $('#loginAlert').addClass('hidden');
                    var ret = UserService.login(user);
                    ret
                        .success(function (user) {
                            if (user === '0') {
                                $('#loginAlert').removeClass('hidden');
                                vm.alert = "No such user";
                            }
                            else {
                                $rootScope.currentUser = user;
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

    function RegisterController($rootScope, $location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if (user.username === undefined || user.password === undefined || user.password2 === undefined) {
                $('#registerAlert').removeClass('hidden');
                vm.alert = 'Please enter the required details';
            }
            else if (user.password != user.password2) {
                $('#registerAlert').removeClass('hidden');
                vm.alert = 'Password does not match';
            }
            else {
                $('#registerAlert').addClass('hidden');
                UserService.createUser(user)
                    .success(function (userObj) {
                        $rootScope.currentUser = userObj;
                        $location.url("/user/" + userObj._id);
                    })
                    .error(function (error) {
                        vm.error = "Cannot create a user";
                    });
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.updateProfile = updateProfile;
        vm.getWebsites = getWebsites;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        var userId = ($routeParams.uid);

        function init() {
            var ret = UserService.findCurrentUser();
            ret
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

        function logout() {
            UserService.logout()
                .then(function () {
                    $rootScope.currentUser = null;
                    $location.url("/#/login");
                })
        }
    }

})();