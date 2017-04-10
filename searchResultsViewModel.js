var microsoft = microsoft || {};
microsoft.learning = microsoft.learning || {};
microsoft.learning.mlx = microsoft.learning.mlx || {};

define(["jquery", "knockout", "jqueryui", "globals"], function ($, ko) {

//$(function () {
    microsoft.learning.mlx.SearchResultsViewModel = (function () {
		var srvm = function () {
	
		    var self = this;
		    self.browseAllCoursesText = ResourceStrings.SR_BrowseAllCourses ? 
                ResourceStrings.SR_BrowseAllCourses.replace("{SearchResultsUrl}", Configurations.SearchResultsUrlTemplate.replace("{Host}", window.location.host)) : "";

		};
	
		srvm.prototype = {
		    setResultsContainerHeight: function () {
		        var self = this;

		        var height = 0;
		        var outerHeight = $(window).outerHeight();
		        var footerHeight = $('footer').height();
		        var headerHeight = $('header').height();

		        if ($(window).width() >= Configurations.tabletResolution) {
		            height = outerHeight - (footerHeight + headerHeight + 110);
		            $('footer').show();
		        }
		        else {
		            height = outerHeight - (headerHeight + 160);
		            $('footer').hide();
		        }

		        $('#searchResultsContainer').css('height', height);
		    },

		    setDivNarrowByHeight: function () {
		        var self = this;

		        if ($(window).width() >= Configurations.tabletResolution)
		        {
		            $('footer').show();
		            $('#searchcourseinfo').attr("aria-hidden", "false");
		        }
		        else
		        {
		            $('footer').hide();
		            $('#searchcourseinfo').attr("aria-hidden", "true");
		        }
		    },

		    initializeUI: function (parentModel) {
		        var self = this;

		        // Binding search query input element
		        $('.quicksearchbox').keydown(function (e) {
		            if (e.which == 13 && $(this).val().trim() !== "") { // Enter key
		                parentModel.search(SearchEventTypes.searchBox);
		            }
		        });

		        // Binding search query glass icon
		        $('.search-box-image').removeAttr("onclick");
		        $('.search-box-image').unbind("onclick");
		        $('.search-box-image').click(function () {
		            if ($('.quicksearchbox').val().trim() !== "") {
		                parentModel.search(SearchEventTypes.searchBox);
		            }
		            return false;
		        });

		        self.setResultsContainerHeight();
		        self.setDivNarrowByHeight();
		    },

		    setSearchProperties: function (parentModel) {
		        var self = parentModel;

		        self.setSortCriteria(self.selectedSort().value, self.selectedSort().sortOrder);
		        // searchModel.inputRequest.DisplayFields = ["CourseId", "CourseName", "CourseDuration", "CourseImage", "CourseShortDescription", "CourseLevel"];
		        self.searchModel.inputRequest.SelectCriteria = [];

		        if (!self.reSearchRequired())
		        {
		            for (var i = 0; i < self.selectCriteriaItems().length; i++)
		                self.searchModel.inputRequest.SelectCriteria.push(self.selectCriteriaItems()[i]);
		        }

		        self.searchModel.itemsPerPage = self.reSearchRequired() ? 1 : self.itemsPerPage();
		        self.searchModel.inputRequest.UILangaugeCode = Configurations.LCID;
		        self.searchModel.inputRequest.UserLanguageCode = Configurations.userLCID > 0 ? Configurations.userLCID : Configurations.LCID;
		        self.searchModel.pageNumber = self.reSearchRequired() ? 1 : ((self.searchEventType() == SearchEventTypes.firstSearch || self.searchEventType() == SearchEventTypes.reSearch) && self.pageNumber() > 1) ? 1 : self.pageNumber();
		        self.searchModel.inputRequest.SearchKeyword = self.searchKeyword();
		        //self.searchModel.inputRequest.CatalogSource = null;
		    },

		    enableDisableTechnologies: function (parentModel) {
		        var self = parentModel;

		        var enabled = false;

		        // Checks if more than one TechnologyCategory is in selectCriteriaItems
		        var count = 0;
		        for (var i = 0; i < self.selectCriteriaItems().length; i++)
		        {
		            if (self.selectCriteriaItems()[i].SelectOnField == SourceHeaders.TechnologiesCategory)
		            {
		                count += 1;
		            }
		        }

		        enabled = (count == 1); // Only one Technology Category must be selected to enable Technologies.

		        if (!enabled)
		        {
		            // Removes all remaining Technologies from SelectCriteriaItems (generates a new array without Technologies)
		            self.removeFromSelectCriteria(SourceHeaders.Technologies);

		            for (var i = 0; i < self.narrowBySections().length; i++)
		            {
		                // Closes TechnologiesCategory & Technologies dropdown.
		                if ((count == 0 && (self.narrowBySections()[i].header() == SourceHeaders.TechnologiesCategory)) || self.narrowBySections()[i].header() == SourceHeaders.Technologies)
		                    self.narrowBySections()[i].isDropdownOpened(false);

		                if (self.narrowBySections()[i].header() == SourceHeaders.Technologies)
		                {
		                    // Sets isSelected = false for all Technologies Narrow-by infos
		                    for (var j = 0; j < self.narrowBySections()[i].narrowByInfos().length; j++)
		                        self.narrowBySections()[i].narrowByInfos()[j].isSelected(false);
		                }
		            }
		        }

		        self.technologiesEnabled(enabled);
		    }
		};
	
		return srvm;
	})();
});

//});
