(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {

        var vm = this;
        vm.login = login;

        function login(username, password) {
            var user = UserService.findUserByCredentials(username, password);
            if (user === null) {
                vm.error = "No such user";
            }
            else {
                $location.url("/user/" + user._id);
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, password2) {
            if (username === undefined || password === undefined || password2 === undefined) {
                vm.error = "Values cannot be blank";
            }
            else if (password != password2) {
                vm.error = "Passwords do not match.";
            }
            else {
                var userJson = {username: username, password: password};
                var user = UserService.createUser(userJson);
                $location.url("/user/" + user._id);
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.updateProfile = updateProfile;
        vm.getWebsites = getWebsites;

        var userId = ($routeParams.uid);

        function init() {
            vm.user = UserService.findUserById(userId);
        }
        init();

        function updateProfile() {
            user = vm.user;
            var userId = ($routeParams.uid);
            var user = UserService.updateUser(userId, user);
        }
        
        function getWebsites() {
            var userId = ($routeParams.uid);
            $location.url("/user/" + user._id + "/website");
        }
    }
})();