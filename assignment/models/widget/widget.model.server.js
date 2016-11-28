module.exports = function () {

    var model = {};

    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        setModel: setModel,
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        deleteAllWidgetsForPage: deleteAllWidgetsForPage,
        reorderWidget: reorderWidget,
        uploadImage: uploadImage
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWidget(pageId, widget) {
        return WidgetModel.create(widget)
            .then(function (widgetObj) {
                model.pageModel.findPageById(pageId)
                    .then(function (pageObj) {
                        pageObj.widgets.push(widgetObj);
                        widgetObj._page = pageObj._id;
                        widgetObj.save();
                        pageObj.save();
                    }, function (error) {
                        console.log(error);
                    });
            }, function (error) {
                console.log(error);
            });
    }

    function findAllWidgetsForPage(pageId) {
        return WidgetModel.find(
            {_page: pageId}
        );
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
                        width: widget.width,
                        description: widget.description
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
    }

    function deleteWidget(widgetId) {
        return WidgetModel.findById(widgetId)
            .then(function (widget) {
                WidgetModel.remove({_id: widgetId})
                    .then(function () {
                        WidgetModel.find(
                            {
                                rank: {$gt: widget.rank}
                            }
                        ).then(function (widgets) {
                            if (widgets.length == 0) {
                                WidgetModel.remove(
                                    {
                                        _id: widgetId
                                    }
                                );
                            }
                            widgets.sort(function (a, b) {
                                return a.rank - b.rank;
                            });
                            //move all widgets below on position up.
                            for (var i = 0; i < widgets.length; i++) {
                                widgets[i].rank = widgets[i].rank - 1;
                                widgets[i].save();
                            }

                        });
                    });
            });
    }

    function deleteAllWidgetsForPage(pageId) {
        return WidgetModel.remove({_page: pageId});
    }

    function reorderWidget(pageId, start, end) {
        //if widget is moved from top to bottom
        if (start < end) {
            return WidgetModel.find({
                    _page: pageId,
                    rank: {$gt: (start - 1), $lt: (end + 1)}
                }
            ).then(function (widgets) {
                if (widgets.length == 1)
                    return;
                widgets.sort(function (a, b) {
                    return a.rank - b.rank;
                });
                widgets[0].rank = end;
                widgets[0].save();
                for (var i = 1; i < widgets.length; i++) {
                    widgets[i].rank = widgets[i].rank - 1;
                    widgets[i].save();
                }
            });
        }
        //if widget is moved from bottom to top
        else {
            return WidgetModel.find({
                    _page: pageId,
                    rank: {$gt: (end - 1), $lt: (start + 1)}
                }
            ).then(function (widgets) {
                if (widgets.length == 1)
                    return;
                widgets.sort(function (a, b) {
                    return a.rank - b.rank;
                });
                widgets[widgets.length - 1].rank = end;
                widgets[widgets.length - 1].save();
                for (var i = 0; i < widgets.length - 1; i++) {
                    widgets[i].rank = widgets[i].rank + 1;
                    widgets[i].save();
                }
            });
        }
    }

    function  uploadImage(widgetId, widget) {
        return WidgetModel.update(
            {_id: widgetId},
            {
                name: widget.name,
                text: widget.text,
                url: widget.url,
                width: widget.width
            });

    }

}
;
