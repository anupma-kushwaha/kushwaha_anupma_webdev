module.exports = function(app) {

    var websites = [
        {_id: "123", name: "Facebook", developerId: "456"},
        {_id: "234", name: "Tweeter", developerId: "456"},
        {_id: "456", name: "Gizmodo", developerId: "456"},
        {_id: "567", name: "Tic Tac Toe", developerId: "123"},
        {_id: "678", name: "Checkers", developerId: "123"},
        {_id: "789", name: "Chess", developerId: "234"}
    ];

    app.post('/api/user/:userId/website',createWebsite);
    app.get('/api/user/:userId/website',findAllWebsitesForUser);
    app.get('/api/website/:websiteId',findWebsiteById);
    app.put('/api/website/:websiteId',updateWebsite);
    app.delete('/api/website/:websiteId',deleteWebsite);

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;
        var id = ((new Date()).getTime()).toString();
        website._id = id;
        website.developerId = userId;
        websites.push(website);
        res.send(website);
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        websitesForUser = [];
        for (var w in websites) {
            website = websites[w];
            if (website.developerId === userId) {
                websitesForUser.push(website)
            }
        }
        res.send(websitesForUser);
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        for (var u in websites) {
            website = websites[u];
            if (website._id === websiteId) {
                res.send(website);
                return;
            }
        }
        res.sendStatus(400);
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        for (var i = 0; i < websites.length; i++) {
            websiteObj = websites[i];
            if (websiteObj._id == websiteId) {
                websiteObj.name = website.name;
                websiteObj.description = website.description;
                res.send(websiteObj);
                return
            }
        }
        res.sendStatus(400);
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        for (var w in websites) {
            website = websites[w];
            if (website._id === websiteId) {
                delete websites[w];
                res.send(websites[w]);
                return
            }
        }
        res.sendStatus(400);
    }
}
