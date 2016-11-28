module.exports = function () {

    var model = {};

    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createPage(websiteId, page) {
        return PageModel.create(page)
            .then(function (pageObj) {
                model.websiteModel.findWebsiteById(websiteId)
                    .then(function (websiteObj) {
                        pageObj._website = websiteObj._id;
                        pageObj.save();
                        websiteObj.pages.push(pageObj);
                        return websiteObj.save();
                    }, function (error) {
                        console.log(error);
                    });
            });
    }

    function findAllPagesForWebsite(websiteId) {
        return PageModel.find(
            {_website : websiteId}
        );
    }

    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }

    function updatePage(pageId, page) {
        return PageModel.update({
                _id: pageId
            },
            {
                name: page.name,
                title: page.title,
                description: page.description
            }
        );
    }

    function deletePage(pageId) {
        return PageModel.remove({_id: pageId});
    }

};






