/// <reference path="scripts/typings/knockout/knockout.d.ts" />
/// <reference path="searchmodel.d.ts" />
/// <reference path="coursesearchviewmodel.d.ts" />
/// <reference path="searchresultsviewmodel.d.ts" />
/// <amd-dependency path="mva2/mva_files/knockout-3.4.2"/>

/// <amd-dependency path="mva2/mva_files/Globals"/>
/// <amd-dependency path="mva2/mva_files/searchResultsViewModel-2017-03-10-1721"/>
/// <amd-dependency path="mva2/mva_files/searchapi_2017-03-27-1235"/>
/// <amd-dependency path="mva2/mva_files/courseSearchViewModel-2017-03-10-1721"/>
/// <amd-dependency path="mva2/mva_files/OverlayViewModels"/>

import $ = require("jquery");

//var searchResultsViewModel = new microsoft.learning.mlx.SearchResultsViewModel();
//import { OverlayViewModels } from "mva2/mva_files/OverlayViewModels";

var searchModel = new microsoft.learning.mlx.SearchModel();
var overlay = new microsoft.learning.mlx.OverlayViewModels();
var busyIndicatoroverlay = overlay.GetBusyIndicatorMessage();
busyIndicatoroverlay.open();

var searchResultsViewModel = new microsoft.learning.mlx.SearchResultsViewModel();

var courseSearchViewModel = new microsoft.learning.mlx.CourseSearchViewModel(searchModel, searchResultsViewModel, overlay);
//set view model object for search autocomplete
var searchViewModel = courseSearchViewModel;

courseSearchViewModel.initialize().done(function () {
    ko.applyBindings(courseSearchViewModel, $("#searchCourseDetailsView")[0]);
});


//var greeter = new g.Greeter("#content");
//greeter.start();