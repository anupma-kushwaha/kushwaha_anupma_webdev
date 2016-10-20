(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService() {
        var widgets = [
            { _id: "123", widgetType: "HEADER", pageId: "321", size: 2, text: "GIZMODO"},
            { _id: "234", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
            { _id: "345", widgetType: "IMAGE", pageId: "321", width: "100%", url: "http://lorempixel.com/400/200/"},
            { _id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
            { _id: "567", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
            { _id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%", url: "https://youtu.be/AM2Ivdi9c4E" },
            { _id: "789", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
            { _id: "890", widgetType: "HTML", pageId: "321", text: '<p> <a href="http://www.amazon.com/Computer-Networks-Approach-Kaufmann-Networking/dp/0123705487"> Computer Networks: A Systems Approach, 4th Edition</a>by Larry Peterson and Bruce Davie, Morgan Kaufmann. </p>'}
        ];

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };
        return api;

        function createWidget(pageId, widget) {
            maxId = 000;
            for (var w in widgets) {
                widgetObj = widgets[w];
                if (parseInt(widgetObj._id) > maxId) {
                    maxId = parseInt(widgetObj._id);
                }
            }
            maxId = maxId +1;
            maxId = maxId.toString();

            widget = {_id: maxId, widgetType:widget.widgetType, size:widget.size, text:widget.text , pageId:widget.pageId};
            widgets.push(widget);
            return widget;
        }

        function findWidgetsByPageId(pageId) {
            widgetsForPage = [];
            for (var w in widgets) {
                widget = widgets[w];
                if (widget.pageId === pageId) {
                    widgetsForPage.push(widget)
                }
            }
            return widgetsForPage;
        }

        function findWidgetById(widgetId) {
            for (var u in widgets) {
                widget = widgets[u];
                if (widget._id === widgetId) {
                    return widget;
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            for (var i = 0; i < widgets.length; i++) {
                widgetsObj = widgets[i];
                if (widgetsObj._id == widgetId) {
                    widgetsObj.widgetType = widget.widgetType;
                    widgetsObj.pageId = widget.pageId;
                    widgetsObj.size = widget.size;
                    widgetsObj.text = widget.text;
                    widgetsObj.url = widget.url;
                    widgetsObj.width = widget.width;
                    break;
                }
            }
            if(widgetsObj._id === widgetId){
                return widgetsObj;
            }
            else{
                return null;
            }
        }

        function deleteWidget(widgetId) {
            for (var w in widgets) {
                widget = widgets[w];
                if (widget._id === widgetId) {
                    delete widgets[w];
                    break;
                }
            }
        }
    }

})();