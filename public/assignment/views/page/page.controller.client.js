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
            PageService
                .findAllPagesForWebsite(wid)
                .success(function (pages){
                    vm.pages = pages;
                })
                .error(function (error){
                    vm.error = "No websites found!";
                });
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
            PageService
                .findAllPagesForWebsite(wid)
                .success(function (pages){
                    vm.pages = pages;
                })
                .error(function (error){
                    vm.error = "No websites found!";
                });
        }
        init();

        function createPage(pageName, pageTitle) {
            var page = {name: pageName, title: pageTitle};
            PageService
                .createPage(wid, page)
                .success(function (page){
                    $location.url("/user/" + uid + "/website/" + wid + "/page");
                })
                .error(function (error){
                    vm.error = "No websites found!";
                });
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
            PageService
                .findAllPagesForWebsite(wid)
                .success(function (pages){
                    vm.pages = pages;
                })
                .error(function (error){
                    vm.error = "No pages found!";
                });

            PageService
                .findPageById(pid)
                .success(function (page){
                    vm.page = page;
                })
                .error(function (error){
                    vm.error = "No page found!";
                });
        }
        init();

        function updatePage(page) {
            PageService
                .updatePage(vm.pid, page)
                .success(function (page){
                    $location.url("/user/" + uid + "/website/" + wid + "/page");
                })
                .error(function (error){
                    vm.error = "No pages found!";
                });
        }

        function deletePage() {
            PageService
                .deletePage(vm.pid)
                .success(function (pages){
                    $location.url("/user/" + uid + "/website/" + wid + "/page");
                })
                .error(function (error){
                    vm.error = "No pages found!";
                });
        }
    }

})();
