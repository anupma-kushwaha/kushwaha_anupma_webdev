module.exports = function () {

    var model = {};

    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({
            username: username
        });
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            username: username,
            password: password
        });
    }

    function updateUser(userId, user) {
        return UserModel.update({
                _id: userId
            },
            {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        );
    }

    function deleteUser(userId) {
        return UserModel.findOne(
            {_id: userId},
            function (err, user) {
                model.websiteModel.findAllWebsitesForUser(userId)
                    .then(function (websites) {
                        for (w in websites) {
                            model.pageModel.findAllPagesForWebsite(websites[w]._id)
                                .then(function (pages) {
                                    for (p in pages) {
                                        model.widgetModel.deleteAllWidgetsForPage(pages[p]._id)
                                            .then(function () {
                                                model.pageModel.deletePage(pages[p])
                                                    .then(function () {
                                                    }, function (error) {
                                                        console.log(error);
                                                    });
                                            }, function (error) {
                                                console.log(error);
                                            });
                                    }
                                    model.websiteModel.deleteWebsite(websites[w])
                                        .then(function () {
                                        }, function (error) {
                                            console.log(error);
                                        });
                                }, function (error) {
                                    console.log(error);
                                })
                        }
                        UserModel.remove({_id: userId})
                            .then(function () {
                                console.log("deleted 1 user " + userId);
                            }, function (error) {
                                console.log(error);
                            });
                    }, function (error) {
                        console.log(error);
                    });
            }
        );
    }

};
