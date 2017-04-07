/// <reference path="coursesearchviewmodel.d.ts" />
/// <reference path="scripts/typings/requirejs/require.d.ts" />
requirejs.config({
    paths: {
        "jquery": "Scripts/jquery-3.1.1",
        "knockout": "Scripts/knockout-3.4.2",
        "searchresults": "../mva2/mva_files/searchResultsViewModel-2017-03-10-1721",
        "CourseSearchViewModel": "mva2/mva_files/courseSearchViewModel-2017-03-10-1721"
    }

});

require(["app"]);
