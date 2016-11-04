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
            UserService
                .findUserByCredentials(username, password)
                .success(function(user){
                    if (user === '0') {
                        vm.error = "No such user";
                    }
                    else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (){
                    vm.error = "No such user";
                });
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
                UserService
                    .createUser(userJson)
                    .success(function (user){
                        $location.url("/user/" + user._id);
                    })
                    .error(function(error){
                        vm.error = "Cannot create a user";
                    });
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.updateProfile = updateProfile;
        vm.getWebsites = getWebsites;

        var userId = ($routeParams.uid);

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user){
                    if(user!='0'){
                        vm.user = user;
                    }
                })
                .error(function (){
                    vm.error = "No such user";
                });
        }
        init();

        function updateProfile() {
            user = vm.user;
            var userId = ($routeParams.uid);
            UserService
                .updateUser(userId, user)
                .success(function (user){
                    vm.user = user;
                })
                .error(function (){
                    vm.error = "No such user";
                });
        }

        function getWebsites() {
            var userId = ($routeParams.uid);
            $location.url("/user/" + userId + "/website");
        }
    }

})();