(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        var pid = ($routeParams.pid);
        vm.uid = uid;
        vm.wid = wid;
        vm.pid = pid;
        vm.safeHtml = safeHtml;
        vm.safeYoutubeUrl = safeYoutubeUrl;
        vm.checkSafeImage = checkSafeImage;
        vm.sortWidget = sortWidget;

        function init() {
            WidgetService
                .findAllWidgetsForPage(pid)
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }

        init();

        function safeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function safeYoutubeUrl(url) {
            var urlStrings = url.split("/");
            url = "https://www.youtube.com/embed/" + urlStrings[urlStrings.length - 1];
            return $sce.trustAsResourceUrl(url);
        }

        function checkSafeImage(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function sortWidget(index1, index2) {
            WidgetService
                .sortWidget(vm.pid, index1, index2)
                .then(
                    function (success) {
                        init();
                    },
                    function (error) {
                        vm.error = "Not able to reorder the widgets";
                    }
                )
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.createWidget = createWidget;
        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        var pid = ($routeParams.pid);
        vm.widgetType = $routeParams["type"];
        vm.uid = uid;
        vm.wid = wid;
        vm.pid = pid;
        vm.widget = new Object();

        function init() {
            WidgetService
                .findAllWidgetsForPage(pid)
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }

        init();

        function createWidget(widget, widgetType) {
            vm.widget.widgetType = widgetType;
            WidgetService.createWidget(vm.pid, vm.widget)
                .success(function (widget) {
                    $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget");
                })
                .error(function (error) {
                    vm.error = "No widget created!";
                });
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;

        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        var pid = ($routeParams.pid);
        var wgid = ($routeParams.wgid);
        vm.uid = uid;
        vm.wid = wid;
        vm.pid = pid;
        vm.wgid = wgid;

        function init() {
            WidgetService
                .findWidgetById(wgid)
                .success(function (widget) {
                    vm.widget = widget;
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }

        init();

        function updateWidget(widget) {
            WidgetService
                .updateWidget(vm.wgid, widget)
                .success(function (widget) {
                    var url = "/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget";
                    $location.url(url);
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }

        function deleteWidget() {
            var r = WidgetService.deleteWidget(vm.wgid);
            r
                .success(function (widget) {
                    $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget");
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }
    }
})();
