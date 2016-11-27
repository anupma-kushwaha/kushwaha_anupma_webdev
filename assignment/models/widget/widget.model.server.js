module.exports = function () {

    var model = {};

    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget,
        updateImage: updateImage,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWidget(pageId, widget) {
        return model
            .pageModel
            .findPageById(pageId)
            .then(function (pageObj) {
                WidgetModel
                    .create(widget)
                    .then(function (widObj) {
                        widObj._page = pageObj._id;
                        widObj.widgetType = widget.widgetType;
                        widObj.save();
                        pageObj.widgets.push(widObj);
                        pageObj.save();
                        return widObj;
                    }, function (error) {
                        console.log(error);
                    });
            });
        /*
         return WidgetModel
         .create(widget)
         .then(function (widObj) {
         model
         .pageModel
         .findPageById(pageId)
         .then(function (pageObj) {
         widObj._page = pageObj._id;
         widObj.widgetType = widget.widgetType;
         widObj.save();
         pageObj.widgets.push(widObj);
         return pageObj.save();
         }, function (error) {
         console.log(error);
         });
         });
         */
    }

    function findAllWidgetsForPage(pageId) {
        return model.pageModel.findAllWidgetsForPage(pageId);
    }

    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget) {
        switch (widget.widgetType) {
            case 'HTML':
                return WidgetModel.update(
                    {_id: widgetId},
                    {
                        name: widget.name,
                        text: widget.text
                    });
                break;
            case 'TEXT':
                return WidgetModel.update(
                    {_id: widgetId},
                    {
                        name: widget.name,
                        text: widget.text,
                        placeholder: widget.placeholder,
                        rows: widget.rows,
                        class: widget.class,
                        formatted: widget.formatted
                    });
                break;
            case 'HEADER':
                return WidgetModel.update(
                    {_id: widgetId},
                    {
                        name: widget.name,
                        text: widget.text,
                        size: widget.size
                    });
                break;
            case 'IMAGE':
                return WidgetModel.update(
                    {_id: widgetId},
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width
                    });
                break;
            case 'YOUTUBE':
                return WidgetModel.update(
                    {_id: widgetId},
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width
                    });
                break;
        }
        /*        return WidgetModel
         .update(
         {
         _id: widgetId
         },
         {
         name: widget.name,
         text: widget.text,
         placeholder: widget.placeholder,
         description: widget.description,
         url: widget.url,
         width: widget.width,
         height: widget.height,
         size: widget.size,
         rows: widget.rows,
         class: widget.class,
         icon: widget.icon,
         deletable: widget.deletable,
         formatted: widget.formatted
         }
         );*/
    }

    function deleteWidget(widgetId) {
        return WidgetModel
            .remove({_id: widgetId});
    }

    function reorderWidget(pageId, start, end) {
        /* TODO
         * function sortWidget(req, res) {
         * */
    }

    function updateImage(widgetId, widget) {
        return WidgetModel.update(
            {_id: widgetId},
            {
                name: widget.name,
                text: widget.text,
                url: widget.url,
                width: widget.width
            });

    }
};

/*

 function sortWidget(req, res) {
 var pageId = req.params.pageId;
 var start = parseInt(req.query.start);
 var end = parseInt(req.query.end);
 var index = 0, startIndex = 0, endIndex = 0;
 for (var w in widgets) {
 var widget = widgets[w];
 var pid = widget.pageId;
 if (pid === pageId) {
 if (index == start) {
 startIndex = w;
 }
 if (index == end) {
 endIndex = w;
 }
 index++;
 }
 }
 widgets.splice(endIndex, 0, widgets.splice(startIndex, 1)[0]);
 res.sendStatus(200);
 }*/
