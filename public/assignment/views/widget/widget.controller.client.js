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
        vm.safeUrl = safeUrl;
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

        function safeUrl(url) {
            urlStrings = url.split("/");
            url = "https://www.youtube.com/embed/" + urlStrings[urlStrings.length - 1];
            console.log(url);
            return $sce.trustAsResourceUrl(url);
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.createWidget = createWidget;
        var uid = ($routeParams.uid);
        var wid = ($routeParams.wid);
        var pid = ($routeParams.pid);
        vm.uid = uid;
        vm.wid = wid;
        vm.pid = pid;
        function init() {
            WidgetService
                .findAllWidgetsForPage(pid)
                .success(function (widgets) {
                    vm.widgets = widgets;
                    vm.widget = {};
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }
        init();

        function createWidget(widgetType) {
            var widget = {widgetType: widgetType, pageId: pid};
            WidgetService
                .createWidget(pid, widget)
                .success(function (widget) {
                    var widgetObj = widget;
                    wgid = widgetObj._id;
                    vm.wgid = wgid;
                    vm.widget = widgetObj;
                    $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget/" + wgid);
                })
                .error(function (error) {
                    vm.error = "No widget found!";
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
                    $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget");
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.wgid)
                .success(function (widget) {
                    $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget");
                })
                .error(function (error) {
                    vm.error = "No widget found!";
                });
        }
    }
})();
