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
            vm.widgets = WidgetService.findWidgetsByPageId(pid);
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
            vm.widgets = WidgetService.findWidgetsByPageId(pid);
            vm.widget = {};
        }

        init();

        function createWidget(widgetType){
            var widget = {widgetType: widgetType, pageId : pid};
            var widgetObj = WidgetService.createWidget(pid, widget);
            wgid = widgetObj._id;
            vm.wgid = wgid;
            vm.widget = widgetObj;
            $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget/" + wgid);
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
            vm.widget = WidgetService.findWidgetById(wgid);
        }

        init();

        function updateWidget(widget) {
            WidgetService.updateWidget(vm.wgid, widget);
            $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.wgid);
            $location.url("/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget");
        }
    }
})();
