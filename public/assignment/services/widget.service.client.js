(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {

        var api = {
            "createWidget": createWidget,
            "findAllWidgetsForPage": findAllWidgetsForPage,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            "sortWidget" : sortWidget

        };
        return api;

        function createWidget(pageId, widget) {
            var url = "/api/page/"+pageId+"/widget";
            return $http.post(url,widget);
        }

        function findAllWidgetsForPage(pageId) {
            var url = "/api/page/"+pageId+"/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId) {
            var url = "/api/widget/"+widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget) {
            var url = "/api/widget/"+widgetId;
            return $http.put(url,widget);
        }

        function deleteWidget(widgetId) {
            var url = "/api/widget/"+widgetId;
            return $http.delete(url);
        }

        function sortWidget(pageId,index1,index2){
            var url = "/page/"+pageId+"/widget?start="+index1+"&end="+index2;
            return $http.put(url);
        }
    }

})();