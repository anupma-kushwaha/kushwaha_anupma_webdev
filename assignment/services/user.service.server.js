module.exports = function (app, model) {

    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(session({
        //use env variable
        //secret: process.env.SESSION_SECRET,
        secret: "this is secret",
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(session({secret: process.env.SESSION_SECRET}));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    passport.use(new LocalStrategy(localStrategy));

    app.post('/api/register', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post('/api/checkLogin', checkLogin);

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function createUser(req, res) {
        var user = req.body;
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

        function findUserByCredentials(req, res) {
            var username = req.query.username;
            var password = req.query.password;
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
        model.userModel.findUserByCredentials(username, password)
            .then(function (user) {
                if (user.username === username && user.password === password) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }
}
