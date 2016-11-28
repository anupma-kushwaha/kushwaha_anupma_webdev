module.exports = function (app, model) {

    var mime = require('mime');   // npm install mime --save
    var multer = require('multer'); // npm install multer --save
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../../public/assignment/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({storage: storage});

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.put("/page/:pageId/widget", sortWidget);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        var maxRank = 0;
        model.widgetModel.findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                    //get the max rank and increment it for the new widget.
                    if (widgets.length == 0)
                        widget.rank = 0;
                    else {
                        for (i in widgets) {
                            if (widgets[i].rank > maxRank)
                                maxRank = widgets[i].rank;
                        }
                        widget.rank = maxRank + 1;
                    }
                    model.widgetModel.createWidget(pageId, widget)
                        .then(
                            function (widObj) {
                                res.send(widObj)
                            },
                            function (error) {
                                res.sendStatus(400).send(error);
                            }
                        )
                }
            )
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
         model.widgetModel.findAllWidgetsForPage(pageId)
            .then(
                function (widgets) {
                    if (widgets) {
                        widgets.sort(function (a, b) {
                            return a.rank - b.rank;
                        });
                        res.json(widgets);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        model
            .widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widObj) {
                    if (widObj) {
                        res.json(widObj);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        model
            .widgetModel
            .updateWidget(widgetId, widget)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        model
            .widgetModel
            .deleteWidget(widgetId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function sortWidget(req, res) {
        var pageId = req.params.pageId;
        var start = parseInt(req.query.start);
        var end = parseInt(req.query.end);
        model
            .widgetModel
            .reorderWidget(pageId, start, end)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var myFile = req.file;
        var width = req.body.width;
        var text = req.body.text;
        var name = req.body.name;
        var description = req.body.description;
        var filename = myFile.filename;     // new file name in upload folder

        var url = '/assignment/uploads/' + filename;
        var widget = {
            "name": name,
            "text": text,
            "url": url,
            "width": width
        };

        model
            .widgetModel
            .updateImage(widgetId, widget)
            .then(
                function (status) {
                    var url = "/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget";
                    res.redirect(url);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

};