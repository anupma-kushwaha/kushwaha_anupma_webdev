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
            vm.websites = WebsiteService.findWebsitesByUser(uid);
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
            vm.websites = WebsiteService.findWebsitesByUser(uid);
        }
        init();

        function createWebsite(websiteName, websiteDesc) {
            var website = {name: websiteName, description: websiteDesc};
            var website = WebsiteService.createWebsite(uid, website);
            $location.url("/user/" + uid + "/website");
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
            vm.websites = WebsiteService.findWebsitesByUser(uid);
            vm.website = WebsiteService.findWebsiteById(wid);
        }
        init();

        function updateWebsite(website) {
            WebsiteService.updateWebsite(vm.wid, website);
            $location.url("/user/" + uid + "/website");
        }

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.wid);
            $location.url("/user/" + uid + "/website");
        }
    }
})();