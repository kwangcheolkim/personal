/// <reference path="ts/coursesearchviewmodel.d.ts" />
/// <reference path="scripts/typings/requirejs/require.d.ts" />
requirejs.config({
    paths: {
        "jquery": "Scripts/jquery-1.12.4",
        "jqueryui": "Scripts/jquery-ui-1.12.1",
        "jquerycookie": "Scripts/jquery.cookie",
        "jquerywidget": "Scripts/jquery-ui-widget-1.8.2",

        "knockout": "Scripts/knockout-3.4.2",
        "bundles": "mva_files/bundles-v1",
        "general": "mva_files/general",
        "microsoftajax": "mva_files/MicrosoftAjax",
        "headerandfooter": "mva_files/headerandfooter",
        "resultsData": "mva_files/resultsData",
        "coursesearch": "mva_files/courseSearchViewModel",
        "searchresults": "mva_files/searchResultsViewModel",
        "overlay": "mva_files/OverlayViewModels",

        "searchapi": "bundles/searchapi",
        "globals": "mva_files/Globals",
        "learnerapi": "bundles/learnerapi",
        "lodash" : "Scripts/lodash"
    },
    urlArgs: "v=" + (new Date()).getTime()
});
require(["app"]);