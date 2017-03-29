microsoft.learning.mlx.SearchModel = function () {
    var n = undefined,
        i = function () {
        this.SelectCriteria = [];
        this.DisplayFields = [];
        this.SortOptions = [];
        this.SearchKeyword = "";
        },
    t = function () {
        n = this;
        n.SearchResultSortOrder = { ascending: 0, descending: 1 };
        n.MatchOption = { Unknown: 0, LargerThan: 1, Equal: 2, SmallerThan: 3 };
        n.TenantApplication = { Unknown: 0, MVA: 1, ITA: 2, SA: 3 };
        n.CatalogSource = { Unknown: 0, All: 1, UserBookmarked: 2, Assigned: 4, OrgPurchased: 8, UserPurchased: 16 };
        n.inputRequest = new i;
        n.pageNumber = 1;
        n.itemsPerPage = 3;
        n.searchResults = "";
    };

    return t.prototype.SelectCriterion = function (n, t, i) {
        this.SelectTerm = n;
        this.SelectOnField = t;
        this.SelectMatchOption = i;
    },
        t.prototype.searchData = function () {
        n = this;
        this.inputRequest.SearchKeyword = this.decodeHtml(this.inputRequest.SearchKeyword);
        var t = MLX.ajax({ type: "POST", url: "/services/search/course?page=" + this.pageNumber + "&items=" + this.itemsPerPage, data: JSON.stringify(this.inputRequest), contentType: "application/json; charset=utf-8", dataType: "json" });
        return t.done(function (t) {
            n.searchResults = t;
        }).fail(function () {
            n.searchResults = null;
        }), t;
    }, 
        t.prototype.searchterm = function (t, i, r) {
        n = this;
        (i === undefined || i === null) && (i = "");
        (r === undefined || r === null) && (r = "");
        var u = MLX.ajax({ type: "GET", url: "/services/search/autocomplete?term=" + t + "&catalogSource=" + i + "&lcids=" + r, contentType: "application/json; charset=utf-8", dataType: "json" });
        return u.done(function (t) {
            n.searchResults = t;
        }).fail(function () {
            n.searchResults = null;
        }), u;
    }, 
        t.prototype.anonymousSearchterm = function (t, i, r) {
        n = this;
        (r === undefined || r === null) && (r = "");
        var u = MLX.ajax({ type: "GET", url: "/services/search/anonymous/" + t + "/autocomplete?term=" + i + "&lcids=" + r, contentType: "application/json; charset=utf-8", dataType: "json" });
        return u.done(function (t) {
            n.searchResults = t;
        }).fail(function () {
            n.searchResults = null;
        }), u;
    }, 
        t.prototype.AnonymousCourseSearch =
        function (t) {
                n = this;
                this.pageNumber = (this.pageNumber - 1) * this.itemsPerPage;
                this.inputRequest.SearchKeyword = this.decodeHtml(this.inputRequest.SearchKeyword);

                //var i = MLX.ajax({ type: "POST", url: "/sdk/search/v1.0/" + t + "/courses?$skip=" + this.pageNumber + "&$top=" + this.itemsPerPage, data: JSON.stringify(this.inputRequest), contentType: "application/json; charset=utf-8", dataType: "json" });

                var url = "/sdk/search/v1.0/" + t + "/courses?$skip=" + this.pageNumber + "&$top=" + this.itemsPerPage; 
                var data = JSON.stringify(this.inputRequest);
                var contentType = "application/json; charset=utf-8";
                var dataType= "json"; 

                n.searchResults = varResultsData;
                
                var dfd = new $.Deferred();
                dfd.resolve(varResultsData);
                
                return dfd.promise();

                //return i.done(
                //    function (t) {
                //        n.searchResults = t;
                //    }).fail(function () {
                //        n.searchResults = null;
                //    }), 
                //i;
        },

        t.prototype.decodeHtml = function (n) {
        return $("<div/>").html(n).text();
    }, t.prototype.getAvailableCollectionIDs = function (n, t, i) {
        return MLX.ajax({ url: "/services/search/course/collectionids?collectionType=" + n + "&languageCode=" + t + "&countryCode=" + i, type: "GET", dataType: "json", contentType: "application/json" });
    }, t.prototype.getCollectionLocalized = function (n, t, i, r) {
        return MLX.ajax({ url: "/services/search/course/localizedcollection?collectionType=" + n + "&collectionId=" + t + "&languageCode=" + i + "&countryCode=" + r, type: "GET", dataType: "json", contentType: "application/json" });
    }, t;
}();
