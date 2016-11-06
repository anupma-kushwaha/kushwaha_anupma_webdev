module.exports = function(app) {
    
    var pages = [
        {_id: "321", name: "Post 1", websiteId: "456"},
        {_id: "432", name: "Post 2", websiteId: "456"},
        {_id: "543", name: "Post 3", websiteId: "456"}
    ];

    app.post('/api/website/:websiteId/page',createPage);
    app.get('/api/website/:websiteId/page',findAllPagesForWebsite);
    app.get('/api/page/:pageId',findPageById);
    app.put('/api/page/:pageId',updatePage);
    app.delete('/api/page/:pageId',deletePage);

    function createPage(req, res){
        var websiteId = req.params.websiteId;
        var page = req.body;
        var id = ((new Date()).getTime()).toString();
        page._id = id;
        page.websiteId = websiteId;
        pages.push(page);
        res.send(page);
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        pagesForWebsite = [];
        for (var w in pages) {
            page = pages[w];
            if (page.websiteId === websiteId) {
                pagesForWebsite.push(page)
            }
        }
        res.send(pagesForWebsite);
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        for (var u in pages) {
            page = pages[u];
            if (page._id === pageId) {
                res.send(page);
                return;
            }
        }
        res.sendStatus(400);
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        for (var i = 0; i < pages.length; i++) {
            pagesObj = pages[i];
            if (pagesObj._id == pageId) {
                pagesObj.name = page.name;
                pagesObj.title = page.title;
                res.send(pagesObj);
                return
            }
        }
        res.sendStatus(400);
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        for (var w in pages) {
            page = pages[w];
            if (page._id === pageId) {
                delete pages[w];
                res.send(pages[w]);
                return
            }
        }
        res.sendStatus(400);
    }
};