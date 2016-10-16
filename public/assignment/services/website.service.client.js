(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService() {

        var websites = [
            {_id: "123", name: "Facebook", developerId: "456"},
            {_id: "234", name: "Tweeter", developerId: "456"},
            {_id: "456", name: "Gizmodo", developerId: "456"},
            {_id: "567", name: "Tic Tac Toe", developerId: "123"},
            {_id: "678", name: "Checkers", developerId: "123"},
            {_id: "789", name: "Chess", developerId: "234"}
        ];

        var api = {
            "createWebsite": createWebsite,
            "findWebsitesByUser": findWebsitesByUser,
            "findWebsiteById": findWebsiteById,
            "updateWebsite": updateWebsite,
            "deleteWebsite": deleteWebsite
        };
        return api;

        function createWebsite(userId, website) {
            website = {_id: "222", name: website.name, description: website.description, developerId: userId};
            websites.push(website);
            return website;
        }

        function findWebsitesByUser(userId) {
            websitesForUser = [];
            for (var w in websites) {
                website = websites[w];
                if (website.developerId === userId) {
                    websitesForUser.push(website)
                }
            }
            return websitesForUser;
        }

        function findWebsiteById(websiteId) {
            for (var u in websites) {
                website = websites[u];
                if (website._id === websiteId) {
                    return website;
                }
            }
            return null;
        }

        function updateWebsite(websiteId, website) {
            for (var i = 0; i < websites.length; i++) {
                websiteObj = websites[i];
                if (websiteObj._id == websiteId) {
                    websiteObj.name = website.name;
                    websiteObj.description = website.description;
                    break;
                }
            }
            if(websiteObj._id === websiteId){
                return websiteObj;
            }
            else{
                return null;
            }
        }

        function deleteWebsite(websiteId) {
            for (var w in websites) {
                website = websites[w];
                if (website._id === websiteId) {
                    delete websites[w];
                    break;
                }
            }
        }
    }

})();