(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
            {_id: "321", name: "Post 1", websiteId: "456"},
            {_id: "432", name: "Post 2", websiteId: "456"},
            {_id: "543", name: "Post 3", websiteId: "456"}
        ];

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };
        return api;

        function createPage(websiteId, page) {
            maxId = 000;
            for (var w in pages) {
                pageObj = pages[w];
                if (parseInt(pageObj._id) > maxId) {
                    maxId = parseInt(pageObj._id);
                }
            }
            maxId = maxId +1;
            maxId = maxId.toString();

            page = {_id: maxId, name: page.name, title: page.title, websiteId: websiteId};
            pages.push(page);
            return page;
        }

        function findPageByWebsiteId(websiteId) {
            pagesForWebsite = [];
            for (var w in pages) {
                page = pages[w];
                if (page.websiteId === websiteId) {
                    pagesForWebsite.push(page)
                }
            }
            return pagesForWebsite;
        }

        function findPageById(pageId) {
            for (var u in pages) {
                page = pages[u];
                if (page._id === pageId) {
                    return page;
                }
            }
            return null;
        }

        function updatePage(pageId, page) {
            for (var i = 0; i < pages.length; i++) {
                pagesObj = pages[i];
                if (pagesObj._id == pageId) {
                    pagesObj.name = page.name;
                    pagesObj.title = page.title;
                    break;
                }
            }
            if(pagesObj._id === pageId){
                return pagesObj;
            }
            else{
                return null;
            }
        }

        function deletePage(pageId) {
            for (var w in pages) {
                page = pages[w];
                if (page._id === pageId) {
                    delete pages[w];
                    break;
                }
            }
        }
    }

})();