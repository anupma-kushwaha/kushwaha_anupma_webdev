module.exports = function (app) {

    var widgets = [
        {_id: "123", widgetType: "HEADER", pageId: "321", size: 2, text: "GIZMODO"},
        {_id: "234", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
        {_id: "345", widgetType: "IMAGE", pageId: "321", width: "100%", url: "http://lorempixel.com/400/200/"},
        {_id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
        {_id: "567", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
        {_id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%", url: "https://youtu.be/AM2Ivdi9c4E"},
        {_id: "789", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
        {
            _id: "890",
            widgetType: "HTML",
            pageId: "321",
            text: '<p> <a href="http://www.amazon.com/Computer-Networks-Approach-Kaufmann-Networking/dp/0123705487"> Computer Networks: A Systems Approach, 4th Edition</a>by Larry Peterson and Bruce Davie, Morgan Kaufmann. </p>'
        }
    ];

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        var id = ((new Date()).getTime()).toString();
        widget._id = id;
        widget.pageId = pageId;
        widgets.push(widget);
        res.send(widget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        widgetsForPage = [];
        for (var w in widgets) {
            widget = widgets[w];
            if (widget.pageId === pageId) {
                widgetsForPage.push(widget)
            }
        }
        res.send(widgetsForPage);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        for (var u in widgets) {
            widget = widgets[u];
            if (widget._id === widgetId) {
                res.send(widget);
                return;
            }
        }
        res.send('0');
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for (var i = 0; i < widgets.length; i++) {
            widgetsObj = widgets[i];
            if (widgetsObj._id == widgetId) {
                widgetsObj.widgetType = widget.widgetType;
                widgetsObj.pageId = widget.pageId;
                widgetsObj.size = widget.size;
                widgetsObj.text = widget.text;
                widgetsObj.url = widget.url;
                widgetsObj.width = widget.width;
                res.send(widgetsObj);
                return
            }
        }
        res.send('0');
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for (var w in widgets) {
            widget = widgets[w];
            if (widget._id === widgetId) {
                delete widgets[w];
                res.send(websites[w]);
                return;
            }
        }
        res.send('0');
    }

};