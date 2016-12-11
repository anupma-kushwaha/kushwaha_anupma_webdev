module.exports = function () {

    var mongoose = require("mongoose");

    var UserScheme = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        role: {type:String, default:"STUDENT", enum: ['ADMIN','STUDENT','FACULTY']},
        websites: [{type: mongoose.Schema.Types.ObjectId, ref: "WebsiteModel"}],
        dateCreated: {type: Date, default: Date.now()},
        facebook: {
            id: String,
            token: String
        }

    }, {collections: "user"});

    return UserScheme;
};