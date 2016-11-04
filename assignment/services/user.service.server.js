module.exports = function(app) {
    var users = [
        {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
        {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
        {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
    ];

    app.post('/api/user',createUser);
    app.get('/api/user',findUser);
    app.get('/api/user/:userId',findUserById);
    app.put('/api/user/:userId',updateUser);
    app.delete('/api/user/:userId',deleteUser);

    function createUser(req, res){
        var user = req.body;
        var id = ((new Date()).getTime()).toString();
        user._id =  id;
        users.push(user);
        res.send(user);
    }

    function findUser(req, res) {

        var query = req.query;
        if(query.password && query.username){
            findUserByCredentials(req, res);
        }else if(query.username) {
            findUserByUsername(req, res);
        }

        function findUserByCredentials(req, res) {
            var username = req.query.username;
            var password = req.query.password;
            for (var u in users) {
                userObj = users[u];
                if (userObj.username === username &&
                    userObj.password === password) {
                    res.send(userObj);
                    return;
                }
            }
            res.send('0');
        }

        function findUserByUsername(req, res) {
            var username = req.query.username;
            for (var u in users) {
                userObj = users[u];
                if (userObj.username === username) {
                    res.send(userObj);
                    return;
                }
            }
            res.send('0');
        }
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        for (var u in users) {
            userObj = users[u];
            if (userObj._id === userId) {
                res.send(userObj);
                return;
            }
        }
        res.send('0');
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;
        for (var i = 0; i < users.length; i++) {
            userObj = users[i];
            if (userObj._id == userId) {
                userObj.username = user.username;
                userObj.firstName = user.firstName;
                userObj.lastName = user.lastName;
                userObj.email = user.email;
                break;
            }
        }
        if(userObj._id === userId){
            res.send(userObj);
            return;        }
        else{
            res.send('0');
        }
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        for (var u in users) {
            userObj = users[u];
            if (userObj._id === userId) {
                delete users[u];
                res.send(200);
                return;
            }
        }
        res.send('0');
    }

}
