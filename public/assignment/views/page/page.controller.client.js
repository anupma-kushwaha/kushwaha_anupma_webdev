(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        vm.uid = uid;
        vm.wid = wid;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(wid);
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {

        var vm = this;
        vm.createPage = createPage;

        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        vm.uid = uid;
        vm.wid = wid;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(wid);
        }
        init();

        function createPage(pageName, pageTitle) {
            var page = {name: pageName, title: pageTitle};
            var page = PageService.createPage(wid, page);
            console.log(JSON.stringify(page));
            $location.url("/user/" + uid + "/website/" + wid + "/page");
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        var pid = ($routeParams.pid);
        vm.uid = uid;
        vm.wid = wid;
        vm.pid = pid;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(wid);
            vm.page = PageService.findPageById(pid);
        }
        init();

        function updatePage(page) {
            PageService.updatePage(vm.pid, page);
            $location.url("/user/" + uid + "/website/" + wid + "/page");
        }

        function deletePage() {
            PageService.deletePage(vm.pid);
            $location.url("/user/" + uid + "/website/" + wid + "/page");
        }
    }

})();
