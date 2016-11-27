module.exports = function () {

    var model = {};

    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        findAllPagesForWebsite: findAllPagesForWebsite,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWebsiteForUser(userId, website) {
        console.log("website model - " + JSON.stringify(website));
        return WebsiteModel
            .create(website)
            .then(function (websiteObj) {
                model
                    .userModel
                    .findUserById(userId)
                    .then(function (userObj) {
                        websiteObj._user = userObj._id;
                        websiteObj.save();
                        userObj.websites.push(websiteObj);
                        return userObj.save();
                    }, function (error) {
                        console.log(error);
                    });
            });
    }

    function findAllWebsitesForUser(userId) {
        return model.userModel.findWebsitesForUser(userId);
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel
            .update(
                {
                    _id: websiteId
                },
                {
                    name: website.name,
                    description: website.description
                }
            );
    }

    function deleteWebsite(websiteId) {
        return WebsiteModel
            .remove({_id: websiteId});
    }

    function findAllPagesForWebsite(websiteId) {
        return WebsiteModel
            .findById(websiteId)
            .populate("pages", "name")
            .exec();
    }
};
