(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        var uid = ($routeParams.uid);

        function init() {
            vm.uid = uid;
            WebsiteService
                .findWebsitesByUser(uid)
                .success(function (user) {
                    vm.websites = user.websites;
                })
                .error(function (error) {
                    vm.error = "No websites found!";
                });
        }
        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;
        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        vm.uid = uid;
        vm.wid = wid;
        function init() {
            WebsiteService
                .findWebsitesByUser(uid)
                .success(function (user) {
                    vm.websites = user.websites;
                })
                .error(function (error) {
                    vm.error = "No websites found!";
                });
        }
        init();

        function createWebsite(websiteName, websiteDesc) {
            var website = {name: websiteName, description: websiteDesc};
            WebsiteService
                .createWebsite(uid, website)
                .success(function (website) {
                    $location.url("/user/" + uid + "/website");
                })
                .error(function (error) {
                    vm.error = "No websites found!";
                });
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;
        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        vm.uid = uid;
        vm.wid = wid;
        function init() {
            WebsiteService
                .findWebsitesByUser(uid)
                .success(function (user) {
                    vm.websites = user.websites;
                })
                .error(function () {
                    vm.error = "No websites found!";
                });

            WebsiteService
                .findWebsiteById(wid)
                .success(function (website) {
                    vm.website = website;
                })
                .error(function () {
                    vm.error = "No website found!";
                });
        }

        init();

        function updateWebsite(website) {
            WebsiteService
                .updateWebsite(vm.wid, website)
                .success(function (website) {
                    $location.url("/user/" + uid + "/website");
                })
                .error(function () {
                    vm.error = "No website found!";
                });
        }

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.wid)
                .success(function (website) {
                    $location.url("/user/" + uid + "/website");
                })
                .error(function () {
                    vm.error = "No website found!";
                });
        }
    }

})();