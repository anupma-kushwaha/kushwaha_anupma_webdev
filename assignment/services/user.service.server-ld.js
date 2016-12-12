module.exports = function (app, model) {

    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require("bcrypt-nodejs");
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(session({
        secret: process.env.SESSION_SECRET || "this is secret",
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/login', passport.authenticate('local'), login);
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.post('/api/register', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.get("/api/user", findCurrentUser);
    app.delete('/api/user/:userId', deleteUser);
    app.post('/api/logout', logout);
    app.post('/api/checkLogin', checkLogin);
    app.get('/api/loggedin', loggedin);

    app.get("/auth/google/callback",
        passport.authenticate('google', {
            successRedirect: '/assignment/#/user/',
            failureRedirect: '/assignment/#/login'
        }));

    var googleConfig = {
        clientID: process.env.clientID || '386397546436-p05skr626rqua6lm3ht7la1ibniecebu.apps.googleusercontent.com',
        clientSecret: process.env.clientSecret || 'wYd4R_LuiBQxGq-hgxrYkr_J',
        callbackURL: process.env.callbackURL || 'http://localhost:3000/auth/google/callback'
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        console.log(profile);
        model.userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username: emailParts[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: email,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser)
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function findCurrentUser(req, res) {
        var params = req.params;
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            res.json(req.user);
        }
    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function createUser(req, res) {
        var user = req.body;
        if (user.password)
            user.password = bcrypt.hashSync(user.password);
        model.userModel.createUser(user)
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function findUser(req, res) {

        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        }
        else {
            res.json(user);
        }

        function findUserByCredentials(req, res) {
            var username = req.query.username;
            //var password = req.query.password;
            var password = bcrypt.hashSync(req.query.password);
            model.userModel.findUserByCredentials(username, password)
                .then(
                    function (user) {
                        if (user) {
                            res.json(user);
                        } else {
                            res.send('0');
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        }

        function findUserByUsername(req, res) {
            var username = req.query.username;
            model.userModel.findUserByUsername(username)
                .then(
                    function (user) {
                        if (user) {
                            res.json(user);
                        } else {
                            res.send('0');
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        }
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model.userModel.findUserById(userId)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    }
                    else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;
        model.userModel.updateUser(userId, user)
            .then(
                function (user) {
                    console.log(user);
                    if (user) {
                        res.send(user);
                    }
                    else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.userModel.deleteUser(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model.userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user != null && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, '0');
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

}
