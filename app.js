/// <reference path="scripts/typings/knockout/knockout.d.ts" />
/// <reference path="ts/searchmodel.d.ts" />
/// <reference path="ts/coursesearchviewmodel.d.ts" />
/// <reference path="ts/searchresultsviewmodel.d.ts" />
define(["jquery", "knockout", "general", "microsoftajax", "headerandfooter", "resultsData", "coursesearch", "searchresults", "searchapi", "overlay"], function ($, ko) {

    var theForm = document.forms['aspnetForm'];
    if (!theForm) {
        theForm = document.aspnetForm;
    };

    function __doPostBack(eventTarget, eventArgument) {
        if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
            theForm.__EVENTTARGET.value = eventTarget;
            theForm.__EVENTARGUMENT.value = eventArgument;
            theForm.submit();
        }
    };

    window.mdo = {
        events: [],
        pushEvent: function (ea, en, ed) {
            this.events.push({
                "eventAction": ea,
                "eventName": en,
                "eventDetails": ed
            });
        }
    };


    var searchModel = new microsoft.learning.mlx.SearchModel();
    var overlay = new microsoft.learning.mlx.OverlayViewModels();
    var busyIndicatoroverlay = overlay.GetBusyIndicatorMessage();
    busyIndicatoroverlay.open();
    var searchResultsViewModel = new microsoft.learning.mlx.SearchResultsViewModel();
    var courseSearchViewModel = new microsoft.learning.mlx.CourseSearchViewModel(searchModel, searchResultsViewModel, overlay);
    //set view model object for search autocomplete
    var searchViewModel = courseSearchViewModel;
    courseSearchViewModel.initialize().done(function () {

        var bind = function () {
            ko.applyBindings(courseSearchViewModel, $("#searchCourseDetailsView")[0]);
        };


        var isBound = function () {
            alert(!!ko.dataFor($("#searchCourseDetailsView")[0]));
        };

    });
});

