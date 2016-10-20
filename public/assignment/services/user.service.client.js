(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService() {
        var users = [
            {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
            {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
            {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
        ];

        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };
        return api;

        function createUser(user) {
            maxId = 000;
            for (var w in users) {
                userObj = users[w];
                if (parseInt(userObj._id) > maxId) {
                    maxId = parseInt(userObj._id);
                }
            }
            maxId = maxId +1;
            maxId = maxId.toString();

            user = {_id: maxId, username: user.username, password: user.password};
            users.push(user);
            return user;
        }

        function findUserById(userId) {
            for (var u in users) {
                user = users[u];
                if (user._id === userId) {
                    return user;
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for (var u in users) {
                user = users[u];
                if (user.username === username) {
                    return user;
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for (var u in users) {
                user = users[u];
                if (user.username === username
                    && user.password === password) {
                    return user;
                }
            }
            return null;
        }

        function updateUser(userId, user) {
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
                return userObj;
            }
            else{
                return null;
            }
        }

        function deleteUser(userId) {
        }
    }
})();