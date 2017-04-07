

var microsoft = microsoft || {};
microsoft.learning = microsoft.learning || {};
microsoft.learning.mlx = microsoft.learning.mlx || {};

    //
    // BEGIN OverlayViewModels.js
    //
var ko = require(['../scripts/knockout-3.4.2']);


        ko.bindingHandlers.notificationPopupBinding = {
            init: function (element, valueAccessor) {
                var self = this;
                if (typeof isIE8 !== "undefined" && isIE8 === true) {
                    document.body.onresize = function () {
                        ko.bindingHandlers.notificationPopupBinding._resize(element, valueAccessor);
                    }
                } else {
                    $(window).on('resize', function () {
                        ko.bindingHandlers.notificationPopupBinding._resize(element, valueAccessor);
                    });
                }
            },
            _resize: function (element, valueAccessor) {
                if ($(element).is(":visible")) {
                    var value = valueAccessor();
                    if (value.valueHasMutated) {
                        value.valueHasMutated();
                    }
                }
            },
            // to display or hide the save drafts/commit popup as needed.
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                if (ko.utils.unwrapObservable(valueAccessor())) {
                    $(element).css("visibility", "visible");
                    $('#overlay').show();
                    // prevent scrolling on the document
                    $('html, body').css('overflow-y', 'hidden');
                    $(element).on('click', '.close', function () {
                        if (viewModel.isShown) {
                            viewModel.isShown(false);
                        }
                    });

                    // Focus the element on the overlay.
                    $(element).find(':focusable:first').focus();
                } else {
                    $(element).css("visibility", "hidden");

                    var visibleOverlayElements = $(".overlay-wrapper, .overlay-wrapper-small, .overlay-loading-wrapper").filter(function () {
                        return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none');
                    });
                    if (visibleOverlayElements.length <= 0) {
                        $("#overlay").hide();
                    }
                    // re-enable scrolling on document
                    $('html, body').removeAttr('style');
                }
            }
        };




    microsoft.learning.mlx.CourseSearchViewModel = (function () {
            var cs = function (searchModel, childViewModel, overlay) {

                var self = this;
                ko.utils.extend(self, childViewModel);
                self.overlay = overlay || new microsoft.learning.mlx.OverlayViewModels();
                self.busyIndicatoroverlay = self.overlay.GetBusyIndicatorMessage();
                self.childModel = childViewModel;
                self.searchModel = searchModel;
                self.learningPlanModel = new microsoft.learning.mlx.LearnerPlayListModel();
                self.searchResults = ko.observable();
                self.selectCriteriaItems = ko.observableArray();
                self.pageNumber = ko.observable(1); // Default
                self.itemsPerPage = ko.observable(Configurations.ItemsPerPage);
                self.infiniteScrollEnabled = true;
                self.isSearching = ko.observable(false);
                self.technologiesEnabled = ko.observable(false);
                self.resultsSet = ko.observableArray();
                self.narrowBySections = ko.observableArray();
                self.searchKeyword = ko.observable("");
                self.maxIndexAllowed = ko.observable(0); // Limit per Search
                self.initializeDeferred = undefined;
                self.resultCount = ko.observable(0);
                self.showListViewLoading = ko.observable(true);
                self.searchEventType = ko.observable(SearchEventTypes.firstSearch);
                self.showOverlay = ko.observable(true); // Only shown on first search
                self.reSearchRequired = ko.observable(false);
                self.userLanguagePreferences = ko.observableArray();
                self.headingText = ko.observable("");
                self.searchTerm = ko.observable("");
                self.userLearningPlans = ko.observableArray();
                self.finalUserLearningPlans = ko.observableArray();
                self.isUserMigrated = ko.observable(Configurations.isMigratedUser); // Becomes true only after user is migrated completely
                self.isMigrationStarted = ko.observable(Configurations.isMigrationStarted); // Becomes true if we want to use MLX service calls
                self.isMigrationCompleted = ko.observable(Configurations.isMigrationCompleted); // Becomes true if we want to use MLX service calls
                self.selectedSort = ko.observable("");
                self.availableSorts = ko.observableArray([
                    { sortName: ResourceStrings.byRelevance, sortOrder: self.searchModel.SearchResultSortOrder.descending, value: mvaConstants.sortRelevance },
                    { sortName: ResourceStrings.byPublishDate, sortOrder: self.searchModel.SearchResultSortOrder.descending, value: mvaConstants.sortPublishedTime }
                ]);

                // Default sort order
                var defaultSortOrder = undefined;
                for (var i = 0; i < self.availableSorts().length; i++) {
                    if (self.availableSorts()[i].value == Configurations.defaultSortOrder) {
                        defaultSortOrder = self.availableSorts()[i];
                        break;
                    }
                }

                self.selectedSort = ko.observable(defaultSortOrder !== undefined ? defaultSortOrder : self.availableSorts()[0]); // Default

                if (Configurations.isMigrationStarted)
                    self.availableSorts().push({ sortName: ResourceStrings.byPopularity, sortOrder: self.searchModel.SearchResultSortOrder.descending, value: mvaConstants.sortPopularity });

                self.isMobileVersion = ko.observable($(window).width() <= Configurations.mobileResolution); // Default

                self.coursesRenderedHandler = function (elements, data) {
                    if ($('#ul-courses').children().length === self.resultsSet().length) {
                        popUpMenusToSection('#ul-courses');
                    }
                }
            };

            cs.prototype = {

                /* 
                    Reads current Query String from URL and sets properties before doing the search process. 
                */
                updateURL: function (searchEventType) {
                    var self = this;

                    var searchText = '';
                    if ($('.quicksearchbox').val() != undefined) {
                        searchText = encodeURIComponent($('.quicksearchbox').val().trim().replace(/ +/g, ' '));
                    }

                    // Gets current hash. Using "location.search" only when returns from sign in.
                    var currentHash = (searchEventType == SearchEventTypes.firstSearch && location.search != "") ? location.search.replace("?", "").split('&') : location.hash.replace("#!", "").split('&');

                    var hash = {
                        ref: "",
                        q: "",
                        index: self.pageNumber(), // Default
                        orderby: self.selectedSort().value.toLowerCase(), // Default
                        prod: "", // Product
                        prodv: "", // Product version
                        topic: "", // Topic
                        level: "", // Level
                        jobf: "", // Job function
                        lang: "", // Language
                        ctype: "" // Content type
                    };

                    // Language preferences logic
                    var _userLanguagePreferences = Array();
                    var userDataCookie = getUserDataCookie();

                    if (typeof (userDataCookie) !== "undefined") {
                        if (userDataCookie.languagePreferences !== "")
                            _userLanguagePreferences = userDataCookie.languagePreferences.split('|');

                        if (!userDataCookie.updatedLanguagePreferences && _userLanguagePreferences.length <= 1) {
                            if (Configurations.UserId > 0 && Configurations.userLCID > 0) {
                                // Sets user LCID as default Language preference
                                self.setLanguagePreference(Configurations.userLCID, false);
                            }
                            else {
                                if (_userLanguagePreferences.length == 1 && parseInt(_userLanguagePreferences[0]) !== parseInt(Configurations.LCID)) {
                                    // UI LCID changed ==> Clear language preference from cookie
                                    self.removeLanguagePreference(parseInt(_userLanguagePreferences[0]), false);
                                }

                                // Sets UI LCID as default Language preference
                                self.setLanguagePreference(Configurations.LCID, false);
                            }

                            // Loads userDataCookie again
                            userDataCookie = getUserDataCookie();
                            if (typeof (userDataCookie) !== "undefined" && userDataCookie.languagePreferences !== "")
                                _userLanguagePreferences = userDataCookie.languagePreferences.split('|');
                        }
                    }

                    self.userLanguagePreferences(_userLanguagePreferences);

                    $.each(currentHash, function (k, v) {
                        var key = v.split('=')[0];
                        var value = v.split('=')[1];
                        hash[key] = value;
                    });

                    // Sets Job Function filter according to last homepage tile visited. (Only if user clicked on "Browse All Courses" in Home Page)
                    if (typeof hash.ref !== "undefined") {
                        if (hash.ref === "browseall") {
                            var userDataCookie = getUserDataCookie();
                            var jobFunction;

                            switch (userDataCookie.lastHomePageTileVisited) {
                                case "developers":
                                    jobFunction = "Developer";
                                    break;
                                case "data-pros":
                                    jobFunction = "Data Professional";
                                    break;
                                case "it-pros":
                                    jobFunction = "IT Pros";
                                    break;
                                default:
                                    jobFunction = "";
                                    break;
                            }

                            hash.jobf = encodeURIComponent(jobFunction);
                        }
                    }

                    // Search text
                    hash.q = searchEventType == SearchEventTypes.firstSearch ? hash.q : (searchEventType == SearchEventTypes.searchBox ? searchText : self.searchKeyword());
                    // Index
                    hash.index = searchEventType == SearchEventTypes.firstSearch ? parseInt(hash.index) : parseInt(self.pageNumber());
                    // Order By
                    hash.orderby = searchEventType == SearchEventTypes.firstSearch ? hash.orderby : self.selectedSort().value.toLowerCase();
                    // Filter criterias
                    if ((searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch) && (hash.prod !== "" || hash.prodv !== "" || hash.topic !== "" || hash.level !== "" || hash.jobf !== "" || hash.lang !== "" || hash.ctype !== "")) {
                        hash.prod = hash.prod !== "" ? hash.prod.split('$') : Array();
                        hash.prodv = hash.prodv !== "" ? hash.prodv.split('$') : Array();
                        hash.topic = hash.topic !== "" ? hash.topic.split('$') : Array();
                        hash.level = hash.level !== "" ? hash.level.split('$') : Array();
                        hash.jobf = hash.jobf !== "" ? hash.jobf.split('$') : Array();
                        hash.lang = hash.lang !== "" ? hash.lang.split('$') : Array();
                        hash.ctype = hash.ctype !== "" ? hash.ctype.split('$') : Array();
                    }
                    else {
                        hash.prod = Array();
                        hash.prodv = Array();
                        hash.topic = Array();
                        hash.level = Array();
                        hash.jobf = Array();
                        hash.lang = Array();
                        hash.ctype = Array();

                        if (searchEventType !== SearchEventTypes.searchBox && searchEventType !== SearchEventTypes.resetFilters) {
                            for (var i = 0; i < self.narrowBySections().length; i++) {
                                for (var j = 0; j < self.narrowBySections()[i].narrowByInfos().length; j++) {
                                    if (self.narrowBySections()[i].narrowByInfos()[j].isSelected()) {
                                        var name = self.narrowBySections()[i].narrowByInfos()[j].name();

                                        switch (self.narrowBySections()[i].header()) {
                                            case SourceHeaders.TechnologiesCategory:    // Product
                                                hash.prod.push(name);
                                                break;
                                            case SourceHeaders.Technologies:            // Product version
                                                hash.prodv.push(name);
                                                break;
                                            case SourceHeaders.Topics:                  // Topic
                                                hash.topic.push(name);
                                                break;
                                            case SourceHeaders.CourseLevel:             // Level
                                                hash.level.push(name);
                                                break;
                                            case SourceHeaders.Audiences:               // Job function
                                                hash.jobf.push(name);
                                                break;
                                            case SourceHeaders.LCID:                    // Language
                                                hash.lang.push(name);
                                                break;
                                            case SourceHeaders.Format:                  // Content type
                                                hash.ctype.push(name);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Sets search message
                    if (hash.q !== "") {
                        var _q = self.decodeURLRecursively(hash.q).replace(/ +/g, ' ');
                        self.searchTerm(_q);
                        $(".quicksearchbox").val(_q);
                    }
                    else {
                        self.searchTerm(ResourceStrings.AllCourses);
                    }

                    // Validations & mappings
                    if (hash.orderby == "recent")
                        hash.orderby = mvaConstants.sortPublishedTime;

                    if (hash.orderby == "rating")
                        hash.orderby = mvaConstants.sortRelevance;

                    if (!self.isValidIndex(hash.index))
                        hash.index = 1;

                    if (!self.isValidSortOrder(hash.orderby))
                        hash.orderby = Configurations.defaultSortOrder;

                    if (searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch && hash.index > 1)
                        self.itemsPerPage(hash.index * Configurations.ItemsPerPage);
                    else
                        self.itemsPerPage(Configurations.ItemsPerPage);

                    // Generates new query hash
                    var newHash = "";
                    newHash += hash.q != "" ? ("q=" + encodeURIComponent(hash.q)) : "";
                    newHash += hash.index > 1 ? "&index=" + hash.index : "";
                    newHash += hash.orderby.toLowerCase() !== Configurations.defaultSortOrder.toLowerCase() ? "&orderby=" + hash.orderby.toLowerCase() : "";

                    if (searchEventType !== SearchEventTypes.resetFilters) {
                        if (searchEventType !== SearchEventTypes.searchBox && hash.prod.length > 0) {
                            newHash += "&prod=";
                            for (var i = 0; i < hash.prod.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.prod[i] + '$') : (encodeURIComponent(hash.prod[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }

                        if (searchEventType !== SearchEventTypes.searchBox && hash.prodv.length > 0) {
                            newHash += "&prodv=";
                            for (var i = 0; i < hash.prodv.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.prodv[i] + '$') : (encodeURIComponent(hash.prodv[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }

                        if (searchEventType !== SearchEventTypes.searchBox && hash.topic.length > 0) {
                            newHash += "&topic=";
                            for (var i = 0; i < hash.topic.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.topic[i] + '$') : (encodeURIComponent(hash.topic[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }

                        if (searchEventType !== SearchEventTypes.searchBox && hash.level.length > 0) {
                            newHash += "&level=";
                            for (var i = 0; i < hash.level.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.level[i] + '$') : (encodeURIComponent(hash.level[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }

                        if (searchEventType !== SearchEventTypes.searchBox && hash.jobf.length > 0) {
                            newHash += "&jobf=";
                            for (var i = 0; i < hash.jobf.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.jobf[i] + '$') : (encodeURIComponent(hash.jobf[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }

                        if (hash.lang.length > 0) {
                            newHash += "&lang=";
                            for (var i = 0; i < hash.lang.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.lang[i] + '$') : (encodeURIComponent(hash.lang[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }
                        else {
                            // User language preferences
                            if (searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch || searchEventType == SearchEventTypes.searchBox) {
                                if (self.userLanguagePreferences().length > 0) {
                                    newHash += "&lang=";
                                    for (var i = 0; i < self.userLanguagePreferences().length; i++)
                                        newHash += (self.userLanguagePreferences()[i] + '$');

                                    newHash = newHash.substring(0, newHash.length - 1);
                                }
                            }
                        }

                        if (searchEventType !== SearchEventTypes.searchBox && hash.ctype.length > 0) {
                            newHash += "&ctype=";
                            for (var i = 0; i < hash.ctype.length; i++)
                                newHash += searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch ? (hash.ctype[i] + '$') : (encodeURIComponent(hash.ctype[i]) + '$');

                            newHash = newHash.substring(0, newHash.length - 1);
                        }
                    }

                    if (newHash.startsWith('&'))
                        newHash = newHash.substring(1, newHash.length);

                    // Sets new hash
                    if (!((searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch) && newHash == "")) {
                        //Replaced "?" with "#!" to form pretty url which indicate to the crawler that your site supports the AJAX crawling scheme
                        //the crawler will modify each AJAX URL such as (e.g. "www.example.com/ajax.html#!key=value" to "www.example.com/ajax.html?_escaped_fragment_=key=value")
                        //server returns the HTML snapshot(headless script) for #! url to crawler
                        history.pushState("", "", Configurations.pathName + "#!" + newHash);

                        if (typeof SearchResultsPage !== "undefined") {
                            if (SearchResultsPage === true) {
                                // Sets new hash in form's action attribute (used when user sign in)
                                var action = "./searchresults.htm?" + newHash;
                                $("[name='aspnetForm']").attr("action", action);
                            }
                        }
                    }


                    // Sets url search text
                    self.searchKeyword(self.decodeURLRecursively(hash.q));
                    // Sets page index
                    self.pageNumber(hash.index);
                    // Sets sort order (if changed)
                    if (self.selectedSort().value.toLowerCase() != hash.orderby.toLowerCase()) {
                        for (var i = 0; i < self.availableSorts().length; i++) {
                            if (self.availableSorts()[i].value.toLowerCase() == hash.orderby.toLowerCase()) {
                                self.selectedSort(self.availableSorts()[i]);
                                break;
                            }
                        }
                    }

                    // Sets filter criterias for firstSearch or searchBox events
                    if (searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch || searchEventType == SearchEventTypes.searchBox) {
                        self.reSearchRequired(searchEventType == SearchEventTypes.firstSearch || (searchEventType == SearchEventTypes.searchBox && (hash.lang.length > 0 || self.userLanguagePreferences().length > 0)));
                        var _selectCriteriaItems = Array();

                        // Product
                        if (hash.prod.length > 0) {
                            for (var i = 0; i < hash.prod.length; i++)
                                _selectCriteriaItems.push({
                                    SelectOnField: SourceHeaders.TechnologiesCategory,
                                    SelectTerm: decodeURIComponent(hash.prod[i]),
                                    SelectMatchOption: self.searchModel.MatchOption.Equal
                                });

                            self.enableDisableTechnologies();
                        }

                        // Product version
                        if (hash.prodv.length > 0 && self.technologiesEnabled()) {
                            for (var i = 0; i < hash.prodv.length; i++)
                                _selectCriteriaItems.push({
                                    SelectOnField: SourceHeaders.Technologies,
                                    SelectTerm: decodeURIComponent(hash.prodv[i]),
                                    SelectMatchOption: self.searchModel.MatchOption.Equal
                                });
                        }

                        // Topic
                        if (hash.topic.length > 0) {
                            for (var i = 0; i < hash.topic.length; i++)
                                _selectCriteriaItems.push({
                                    SelectOnField: SourceHeaders.Topics,
                                    SelectTerm: decodeURIComponent(hash.topic[i]),
                                    SelectMatchOption: self.searchModel.MatchOption.Equal
                                });
                        }

                        // Level
                        if (hash.level.length > 0) {
                            for (var i = 0; i < hash.level.length; i++)
                                _selectCriteriaItems.push({
                                    SelectOnField: SourceHeaders.CourseLevel,
                                    SelectTerm: decodeURIComponent(hash.level[i]),
                                    SelectMatchOption: self.searchModel.MatchOption.Equal
                                });
                        }

                        // Job function
                        if (hash.jobf.length > 0) {
                            for (var i = 0; i < hash.jobf.length; i++)
                                _selectCriteriaItems.push({
                                    SelectOnField: SourceHeaders.Audiences,
                                    SelectTerm: decodeURIComponent(hash.jobf[i]),
                                    SelectMatchOption: self.searchModel.MatchOption.Equal
                                });
                        }

                        // Language
                        if (!self.reSearchRequired()) {
                            if (hash.lang.length > 0) {
                                for (var i = 0; i < hash.lang.length; i++)
                                    _selectCriteriaItems.push({
                                        SelectOnField: SourceHeaders.LCID,
                                        SelectTerm: decodeURIComponent(hash.lang[i]),
                                        SelectMatchOption: self.searchModel.MatchOption.Equal
                                    });
                            }
                            else {
                                // Use language preferences
                                if (self.userLanguagePreferences().length > 0) {
                                    for (var i = 0; i < self.userLanguagePreferences().length; i++)
                                        _selectCriteriaItems.push({
                                            SelectOnField: SourceHeaders.LCID,
                                            SelectTerm: decodeURIComponent(self.userLanguagePreferences()[i]),
                                            SelectMatchOption: self.searchModel.MatchOption.Equal
                                        });
                                }
                            }
                        }

                        // Content type
                        if (hash.ctype.length > 0) {
                            for (var i = 0; i < hash.ctype.length; i++)
                                _selectCriteriaItems.push({
                                    SelectOnField: SourceHeaders.Format,
                                    SelectTerm: decodeURIComponent(hash.ctype[i]),
                                    SelectMatchOption: self.searchModel.MatchOption.Equal
                                });
                        }

                        self.selectCriteriaItems([]);
                        self.selectCriteriaItems(_selectCriteriaItems);
                    }
                },

                /*
                    Checks if a given sort value is a valid one.
                */
                isValidSortOrder: function (sortValue) {
                    var self = this;
                    for (var i = 0; i < self.availableSorts().length; i++)
                        if (self.availableSorts()[i].value.toLowerCase() == sortValue.toLowerCase()) return true;

                    return false;
                },

                /*
                    Checks if a given value is a valid index.
                */
                isValidIndex: function (value) {
                    return typeof value === "number" &&
                       isFinite(value) &&
                       Math.floor(value) === value;
                },

                /*
                    Represents a course given from the SearchModel API.
                */
                searchResult: function (item, parentModel, searchText, userLearningPlans, isUserMigrated, isMigrationStarted, isMigrationCompleted, searchRank) {
                    var self = this;

                    self.courseName = ko.observable(item.courseName);
                    self.courseId = ko.observable(item.id);
                    self.Id = ko.observable(item.id);
                    self.Name = ko.observable(item.courseName);
                    self.courseImage = ko.observable(item.courseImage);
                    self.courseDescription = ko.observable(removeTagsCourseDescription(item.courseShortDescription));
                    self.courseLevel = ko.observable(item.courseLevel ? item.courseLevel : "");
                    self.LanguageCode = ko.observable(item.languageCode);
                    self.courseFriendlyName = getCoursePlayerFriendlyName(item.id, item.courseName);
                    self.authorInfo = item.authorInfo;
                    self.publishedTime = getDateDiffString(item.publishedTime);
                    self.IsLiveEventExisting = ko.observable(item.IsLiveEventExisting);
                    self.learningPlanIds = ko.observableArray();
                    self.lplist = [];
                    self.totalRatings = ko.observable(0);
                    self.averageRatings = ko.observable(0);
                    self.isInLearningPlan = ko.observable(false);
                    self.courseLearningPlans = ko.observableArray();
                    self.isPostProduction = ko.observable(item.isPostProduction);
                    self.searchText = ko.observable(searchText);
                    self.isUserMigrated = ko.observable(isUserMigrated);
                    self.isMigrationStarted = ko.observable(isMigrationStarted);
                    self.isMigrationCompleted = ko.observable(isMigrationCompleted);
                    self.courseVersion = ko.observable(item.version);
                    self.searchRank = ko.observable(searchRank);
                    self.rateStarCount = ko.observable(0);

                    self.showInLearningPlanIcon = ko.computed(function () {
                        return ((Configurations.UserId > 0 || (Configurations.isMigrationCompleted && MLX.context.currentUser.currentUserId > 0)) && self.isInLearningPlan());
                    });

                    if (item.courseRatings.length > 0) {
                        self.totalRatings(item.courseRatings[0].ratingCount);
                        var rateValue = ((item.courseRatings[0].averageRatingValue) / 5) * 100;
                        self.averageRatings(rateValue);

                        var rateStarCount = Math.round(item.courseRatings[0].averageRatingValue * 10) / 10;
                        self.rateStarCount(rateStarCount);
                    }

                    var lpList = new Array();
                    if ((self.isUserMigrated() && self.isMigrationStarted()) || (self.isMigrationCompleted() && MLX.context.currentUser.currentUserId > 0)) {
                        if (userLearningPlans.length > 0) {
                            for (var i = 0; i < userLearningPlans.length; i++) {
                                var lp = {
                                    id: userLearningPlans[i].id,
                                    name: userLearningPlans[i].name,
                                    containsCourse: false,
                                    totalCourses: userLearningPlans[i].items.length
                                };

                                for (var j = 0; j < userLearningPlans[i].items.length; j++) {
                                    var item = userLearningPlans[i].items[j];
                                    if (item.idmlx != null && item.idmlx == self.courseId() && item.languageCodeMLX.toLowerCase() == self.LanguageCode().toLowerCase()) {
                                        lp.containsCourse = true;
                                        self.isInLearningPlan(true);
                                    }
                                }

                                lpList.push(lp);
                            }
                        }
                    }
                    else {
                        if (UserLearningPlan) {
                            for (var i = 0; i < UserLearningPlan.length; i++) {
                                var lp = {
                                    id: UserLearningPlan[i].ID,
                                    name: UserLearningPlan[i].Name,
                                    containsCourse: false,
                                    totalCourses: UserLearningPlan[i].Items.length
                                };

                                for (var j = 0; j < UserLearningPlan[i].Items.length; j++) {
                                    var item = UserLearningPlan[i].Items[j];
                                    if (item.IdMLX != null && item.IdMLX == self.courseId() && item.LanguageCodeMLX.toLowerCase() == self.LanguageCode().toLowerCase()) {
                                        lp.containsCourse = true;
                                        self.isInLearningPlan(true);
                                    }
                                }

                                lpList.push(lp);
                            }
                        }
                    }

                    self.courseLearningPlans(lpList);

                    //Initially hiding the sort menu
                    $(".sort-dropdown-menu").hide();

                    this.trackSearchResultClick = ko.computed(function () {
                        return "trackSearchResultsCourseLink('" + self.courseName() + "', '" + self.courseLevel() + "', " + self.Id() + ", " + self.searchRank() + ")";
                    });

                    this.coursePlayerURL = ko.computed(function () {
                        if (!window.location.origin)
                            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

                        return Configurations.CoursePlayerUrlTemplate
                            .replace('{Host}', window.location.host)
                            .replace('{LanguageCode}', self.LanguageCode())
                            .replace('{FriendlyName}', self.courseFriendlyName);
                    });

                    this.displayCourseDescription = ko.computed(function () {
                        var _description = removeTagsCourseDescription(self.courseDescription());

                        return boldSearchTerms(_description, decodeURIComponent(self.searchText()));
                    });

                    this.displayCourseName = ko.computed(function () {
                        var _name = removeTagsCourseDescription(self.courseName());

                        return boldSearchTerms(_name, decodeURIComponent(self.searchText()));
                    });

                    this.displayCourseLevel = ko.computed(function () {

                        return getLevelName(self.courseLevel());
                    });
                },

                /*
                    Represents a type of filter.
                */
                narrowBySection: function (item, parentModel) {
                    var self = this;

                    self.header = ko.observable(item.header);
                    self.localizeHeader = ko.observable(item.localizeHeader);
                    self.narrowByInfos = ko.observableArray();
                    self.isDropdownOpened = ko.observable(false);
                    self.visible =
                        (typeof TypesOfPage === "undefined")
                        || (typeof TypesOfPage !== "undefined"
                            && (Configurations.typeOfPage == TypesOfPage.Product && item.header != SourceHeaders.TechnologiesCategory)
                                || (Configurations.typeOfPage == TypesOfPage.Topic && item.header != SourceHeaders.Topics));

                    this.displayOrder = ko.computed(function () {
                        var self = this;
                        switch (item.header) {
                            case SourceHeaders.Audiences:
                                return 5;
                                break;
                            case SourceHeaders.Format:
                                return 7;
                                break;
                            case SourceHeaders.Technologies:
                                return 2;
                                break;
                            case SourceHeaders.TechnologiesCategory:
                                return 1;
                                break;
                            case SourceHeaders.Topics:
                                return 3;
                                break;
                            case SourceHeaders.LCID:
                                return 6;
                                break;
                            case SourceHeaders.CourseLevel:
                                return 4;
                                break;
                            case SourceHeaders.StarRating:
                                return 0; // Not required
                                break;
                            default:
                                return 0;
                        }
                    });

                    this.displayName = ko.computed(function () {
                        var self = this;

                        switch (item.header) {
                            case SourceHeaders.Audiences:               // Job function
                                return ResourceStrings.SR_JobFunction;
                                break;
                            case SourceHeaders.Format:                  // Content type
                                return ResourceStrings.SR_ContentType;
                                break;
                            case SourceHeaders.TechnologiesCategory:    // Product
                                return ResourceStrings.SR_Product;
                                break;
                            case SourceHeaders.Technologies:            // Product version
                                return ResourceStrings.SR_ProductVersion;
                                break;
                            case SourceHeaders.Topics:                  // Topic
                                return ResourceStrings.SR_Topic;
                                break;
                            case SourceHeaders.LCID:                    // Language
                                return ResourceStrings.SR_Language;
                                break;
                            case SourceHeaders.CourseLevel:             // Level
                                return ResourceStrings.SR_Level;
                                break;
                            case SourceHeaders.StarRating:
                                return "";
                                break;
                            default:
                                return "";
                        }
                    });

                    this.selectedNarrowByInfosCount = ko.computed(function () {
                        var count = 0;

                        for (var i = 0; i < self.narrowByInfos().length; i++) {
                            if (self.narrowByInfos()[i].isSelected()) count++;
                        }

                        return count;
                    });
                },

                /*
                    Represents a child of a type of filter.
                */
                narrowByInfo: function (item, parentHeader) {
                    var self = this;

                    self.id = item.name.replace(/\s/g, "_");
                    self.name = ko.observable(item.name);
                    self.localizedName = ko.observable(item.localizedName);
                    self.count = ko.observable(item.count);
                    self.isSelected = ko.observable(false);
                    self.parentHeader = ko.observable(parentHeader);
                    self.friendlyName = parentHeader.toLowerCase() + '_' + item.name.toLowerCase()
                        .replace(/[^\w ]+/g, '')
                        .replace(/ +/g, '-')
                        .replace('.', '-')
                        .replace(',', '-');

                    this.displayName = ko.computed(function () {

                        switch (self.parentHeader()) {
                            case SourceHeaders.LCID:
                                return getLanguageNameByLCID(self.name());
                            case SourceHeaders.CourseLevel:
                                return getLevelName(self.name());
                            default:
                                return self.localizedName();
                        }
                    });
                },

                /*
                    Represents a Learning Plan from MVA.
                */
                learningPlan: function (item, parentModel) {
                    var self = this;

                    self.id = ko.observable(item.ID);
                    self.name = ko.observable(item.Name);
                    self.listOrder = ko.observable(item.ListOrder);
                    self.items = ko.observableArray();

                    var _items = self.items();

                    for (var i = 0; i < self.items().length; i++)
                        _items.push(new self.learningPlanItem(self.items()[i], null));

                    self.items(_items);
                },

                /*
                    Represents a Learning Plan item from MVA.
                */
                learningPlanItem: function (item, parentModel) {
                    var self = this;

                    self.friendlyName = ko.observable(item.FriendlyName);
                    self.friendlyNameMLX = ko.observable(item.FriendlyNameMLX);
                    self.id = ko.observable(item.ID);
                    self.idMLX = ko.observable(item.IdMLX);
                    self.languageCode = ko.observable(item.LanguageCode);
                    self.listOrder = ko.observable(item.ListOrder);
                    self.name = ko.observable(item.Name);
                    self.progress = ko.observable(item.Progress);
                    self.type = ko.observable(item.Type);
                    self.usePlayerMLX = ko.observable(item.UsePlayerMLX);
                },

                /*
                    Handles the search process from a given event type. Makes the call to the Search Model API.
                */
                search: function (searchEventType, sourceHeader) {
                    var self = this;
                    self.disableCheckBoxes();
                    self.isSearching(true);
                    self.searchEventType(searchEventType);

                    // Handle type of search:
                    switch (searchEventType) {
                        case SearchEventTypes.searchBox:
                            self.switchOverlay(true);
                            self.showListViewLoading(false);
                            self.pageNumber(1);
                            self.infiniteScrollEnabled = true;
                            self.selectCriteriaItems([]);
                            self.enableDisableTechnologies();
                            break;
                        case SearchEventTypes.infiniteScroll:
                            self.showListViewLoading(true);
                            self.pageNumber(self.pageNumber() + 1);
                            break;
                        case SearchEventTypes.sortOrder:
                            self.showListViewLoading(true);
                            self.pageNumber(1);
                            self.infiniteScrollEnabled = true;
                            break;
                        case SearchEventTypes.selectCriteriaApplied:
                            self.showListViewLoading(true);
                            self.pageNumber(1);
                            self.infiniteScrollEnabled = true;
                            break;
                        case SearchEventTypes.selectCriteriaRemoved:
                            self.showListViewLoading(true);
                            self.pageNumber(1);
                            self.infiniteScrollEnabled = true;
                            break;
                        case SearchEventTypes.firstSearch:
                            self.switchOverlay(true);
                            self.showListViewLoading(false);
                            self.pageNumber(1);
                            self.infiniteScrollEnabled = true;
                            break;
                        case SearchEventTypes.resetFilters:
                            self.showListViewLoading(true);
                            self.pageNumber(1);
                            self.infiniteScrollEnabled = true;
                            self.selectCriteriaItems([]);
                            self.enableDisableTechnologies();
                            self.clearLanguagePreferences();
                            break;
                        default:
                            break;
                    }

                    // Refresh URL with new data
                    self.updateURL(searchEventType);
                    // Setting search properties
                    self.setSearchProperties();

                    $('.ui-autocomplete').hide();

                    var promise = self.searchModel.AnonymousCourseSearch(5);
                    promise.done(function (results) {

                        self.searchResults(results);
                        self.bindResults(searchEventType, sourceHeader);
                        self.enableCheckBoxes();
                    })
                },

                /*
                    Displays an error message.
                */
                displayError: function (error) {
                    var self = this;
                    self.switchOverlay(false);
                    self.overlay.GetErrors([{ ErrorMessage: error, Id: 0 }], ResourceStrings.MVA_ServiceUnavailableErrorHeading, ResourceStrings.MVA_ServiceUnavailableClose).open().done(function () { });
                },

                /*
                    Sets properties to the Search Model's input Request.
                */
                setSearchProperties: function () {
                    var self = this;

                    self.childModel.setSearchProperties(self);
                },

                /*
                    Fires the first time User enter the page.
                */
                initialize: function () {
                    var self = this;
                    $('#coursedetails').hide();
                    self.initializeDeferred = $.Deferred();
                    // Start search process
                    self.search(SearchEventTypes.firstSearch);

                    $(document).ready(function () {
                        // INFINITE SCROLL
                        $('#searchResultsContainer').scroll(function () {
                            if (self.infiniteScrollEnabled) {
                                if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 5)) {
                                    if (!self.isSearching())
                                        self.search(SearchEventTypes.infiniteScroll);
                                }
                            }
                        });

                        $(document).click(function (e) {
                            // Hide sort dropdown when clicking outside of it
                            var sortDropDownMenu = $(".sort-dropdown-menu");
                            var arangeBy = $("#arrange-by");

                            if ((!sortDropDownMenu.is(e.target) && sortDropDownMenu.has(e.target).length === 0)) {
                                if (!arangeBy.is(e.target) && arangeBy.has(e.target).length === 0)
                                    if (sortDropDownMenu.css("display") === "block") sortDropDownMenu.hide();
                            }

                            // Hide learning plan callout when clicking outside of it
                            var learningPlan = $(".learning-plan");
                            var lpCallOutPopup = $(".parent-popup");

                            if ((!learningPlan.is(e.target) && learningPlan.has(e.target).length === 0)) {
                                if (!lpCallOutPopup.is(e.target) && lpCallOutPopup.has(e.target).length === 0)
                                    lpCallOutPopup.hide();
                            }
                        });

                        // Set height of Search results container on resize
                        // Set filter mobile position on resize
                        self.initializeUI();
                        $(window).resize(function () {
                            self.setResultsContainerHeight();
                            self.setDivNarrowByHeight();
                            self.isMobileVersion($(window).width() <= Configurations.mobileResolution);
                            showOrHideButtonDescriptionProductTopic();
                        });
                    });

                    self.initializeDeferred.resolve();

                    self.selectedSort.subscribe(function (newValue) {
                        // Tracking
                        trackSearchResultsArrangeBy(self.selectedSort().sortName);
                        self.search(SearchEventTypes.sortOrder);
                    });

                    $(document).on('click', function (event) {
                        if (!$(event.target).closest('.sr-filter-type').length)
                            self.hideFilters(null, false);
                    });

                    return self.initializeDeferred.promise();
                },

                /*
                    Initializes the UI of the page.
                */
                initializeUI: function () {
                    var self = this;

                    self.childModel.initializeUI(self);
                },

                /*
                    Fires when Search promise is done.
                */
                bindResults: function (searchEventType, sourceHeader) {
                    var self = this;

                    self.resultCount(self.searchResults().totalResultCount);

                    if (!self.reSearchRequired()) {
                        if (searchEventType !== SearchEventTypes.infiniteScroll)
                            self.resultsSet([]);

                        var _resultsSet = self.resultsSet();
                        for (var i = 0; i < self.searchResults().results.length; i++)
                            _resultsSet.push(new self.searchResult(self.searchResults().results[i], null, self.searchKeyword(), self.userLearningPlans(), self.isUserMigrated(), self.isMigrationStarted(), self.isMigrationCompleted(), _resultsSet.length + 1));

                        self.resultsSet(_resultsSet);

                        if (searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.searchBox || searchEventType == SearchEventTypes.resetFilters)
                            self.resetFilters();

                        if (searchEventType == SearchEventTypes.selectCriteriaApplied || searchEventType == SearchEventTypes.selectCriteriaRemoved || searchEventType == SearchEventTypes.reSearch)
                            self.refreshFilters(searchEventType, sourceHeader);

                        if (self.resultCount() == 0) {
                            for (var i = 0; i < self.narrowBySections().length; i++) {
                                if (self.narrowBySections()[i].header() != SourceHeaders.LCID)
                                    self.narrowBySections()[i].isDropdownOpened(false);
                            }
                        }

                        if (searchEventType != SearchEventTypes.infiniteScroll)
                            self.maxIndexAllowed(Math.ceil(self.searchResults().totalResultCount / Configurations.ItemsPerPage));

                        if (self.searchResults().totalResultCount < self.itemsPerPage() || self.pageNumber() >= self.maxIndexAllowed())
                            self.infiniteScrollEnabled = false;

                        // Tracking
                        if ((searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch) && self.searchKeyword() !== "")
                            trackSearchResults(decodeURIComponent(self.searchKeyword()), self.resultCount());

                        if ((searchEventType == SearchEventTypes.firstSearch || searchEventType == SearchEventTypes.reSearch || searchEventType == SearchEventTypes.searchBox) && self.selectCriteriaItems().length > 0)
                            self.checkItemsBySelectCriteria();

                        $('#coursedetails').show();
                        $(".sort-dropdown-menu").hide();
                        self.isSearching(false);
                        self.showListViewLoading(false);
                        self.reSearchRequired(false);
                        self.switchOverlay(false);
                        closePopups(true, false);
                        showOrHideButtonDescriptionProductTopic();
                        if (searchEventType == SearchEventTypes.selectCriteriaApplied || searchEventType == SearchEventTypes.selectCriteriaRemoved)
                            self.enableCheckBoxes();
                    }
                    else {
                        self.resetFilters();
                        self.search(SearchEventTypes.reSearch);
                    }
                },

                /*
                    Checks checkboxes depending on the searchCriteriaItems.
                */
                checkItemsBySelectCriteria: function () {
                    var self = this;

                    // Set isSelected as true for matching NarrowByInfos in selectCriteriaItems
                    for (var i = 0; i < self.narrowBySections().length; i++) {
                        for (var j = 0; j < self.narrowBySections()[i].narrowByInfos().length; j++) {
                            for (var k = 0; k < self.selectCriteriaItems().length; k++) {
                                if (self.narrowBySections()[i].narrowByInfos()[j].parentHeader() == self.selectCriteriaItems()[k].SelectOnField && self.narrowBySections()[i].narrowByInfos()[j].name() == self.selectCriteriaItems()[k].SelectTerm) {
                                    self.narrowBySections()[i].narrowByInfos()[j].isSelected(true);

                                    if (self.searchEventType() == SearchEventTypes.searchBox)
                                        self.narrowBySections()[i].isDropdownOpened(true);
                                }
                            }
                        }
                    }
                },

                /*
                    Reset the NarrowBySections Array with the new data from the API.
                */
                resetFilters: function () {
                    var self = this;

                    if (self.resultCount() > 0 || (self.resultCount() == 0 && self.userLanguagePreferences().length > 0 && self.searchResults().narrowBySections.length > 0)) {
                        if (self.searchEventType() == SearchEventTypes.firstSearch || self.searchEventType() == SearchEventTypes.searchBox) {
                            var index = 0; // The real index
                            var _narrowBySections = Array();
                            for (var i = 0; i < self.searchResults().narrowBySections.length; i++) {
                                // Excluding StarRating and Format
                                if (self.searchResults().narrowBySections[i].header != SourceHeaders.StarRating && self.searchResults().narrowBySections[i].header != SourceHeaders.Format) {
                                    _narrowBySections.push(new self.narrowBySection(self.searchResults().narrowBySections[i]));

                                    var _narrowByInfos = Array();
                                    for (var j = 0; j < self.searchResults().narrowBySections[i].narrowByInfos.length; j++)
                                        _narrowByInfos.push(new self.narrowByInfo(self.searchResults().narrowBySections[i].narrowByInfos[j], self.searchResults().narrowBySections[i].header));

                                    // Pushes existing Language Preferences if necessary
                                    if (self.searchResults().narrowBySections[i].header == SourceHeaders.LCID && self.userLanguagePreferences().length > 0) {
                                        for (var ii = 0; ii < self.userLanguagePreferences().length; ii++) {
                                            var inArray = false;
                                            for (var jj = 0; jj < _narrowByInfos.length; jj++) {
                                                if (self.userLanguagePreferences()[ii] == _narrowByInfos[jj].name()) {
                                                    inArray = true;
                                                    break;
                                                }
                                            }

                                            if (!inArray) {
                                                _narrowByInfos.push(new self.narrowByInfo(
                                                    {
                                                        name: self.userLanguagePreferences()[ii],
                                                        localizedName: self.userLanguagePreferences()[ii],
                                                        count: 0
                                                    },
                                                    SourceHeaders.LCID
                                                ));
                                            }
                                        }
                                    }

                                    _narrowBySections[index].narrowByInfos(_narrowByInfos);

                                    // Sort each narrowByInfo from a to z
                                    _narrowBySections[index].narrowByInfos().sort(function (a, b) {
                                        if (a.localizedName() < b.localizedName()) return -1;
                                        if (a.localizedName() > b.localizedName()) return 1;
                                        return 0;
                                    });

                                    index++;
                                }
                            }

                            // Sort narrowBySections by display order
                            _narrowBySections.sort(function (a, b) {
                                if (a.displayOrder() < b.displayOrder()) return -1;
                                if (a.displayOrder() > b.displayOrder()) return 1;
                                return 0;
                            });

                            self.narrowBySections([]);
                            self.narrowBySections(_narrowBySections);
                        }
                        else // self.searchEventType() == SearchEventTypes.resetFilters
                        {
                            // Updates "count" field
                            for (var i = 0; i < self.narrowBySections().length; i++) {
                                for (var j = 0; j < self.searchResults().narrowBySections.length; j++) {
                                    if (self.narrowBySections()[i].header() == self.searchResults().narrowBySections[j].header) {
                                        for (var k = 0; k < self.narrowBySections()[i].narrowByInfos().length; k++) {
                                            self.narrowBySections()[i].narrowByInfos()[k].count(0);

                                            if (self.searchEventType() == SearchEventTypes.resetFilters)
                                                self.narrowBySections()[i].narrowByInfos()[k].isSelected(false);

                                            for (var l = 0; l < self.searchResults().narrowBySections[j].narrowByInfos.length; l++) {
                                                if (self.narrowBySections()[i].narrowByInfos()[k].name() == self.searchResults().narrowBySections[j].narrowByInfos[l].name)
                                                    self.narrowBySections()[i].narrowByInfos()[k].count(self.searchResults().narrowBySections[j].narrowByInfos[l].count);
                                            }
                                        }

                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // No results. Only show narrowBySections
                        var _narrowBySections = Array();
                        _narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.Audiences, localizeHeader: SourceHeaders.Audiences }));
                        //_narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.Format, localizeHeader: SourceHeaders.Format })); // Not required
                        _narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.Technologies, localizeHeader: SourceHeaders.Technologies }));
                        _narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.TechnologiesCategory, localizeHeader: SourceHeaders.TechnologiesCategory }));
                        _narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.Topics, localizeHeader: SourceHeaders.Topics }));
                        _narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.LCID, localizeHeader: SourceHeaders.LCID }));

                        if (self.userLanguagePreferences().length > 0) {
                            // Pushes existing Language Preferences
                            for (var i = 0; _narrowBySections.length; i++) {
                                if (_narrowBySections[i].header() == SourceHeaders.LCID) {
                                    var _narrowByInfos = Array();
                                    for (var j = 0; j < self.userLanguagePreferences().length > 0; j++) {
                                        _narrowByInfos.push(new self.narrowByInfo(
                                            {
                                                name: self.userLanguagePreferences()[j],
                                                localizedName: self.userLanguagePreferences()[j],
                                                count: 0
                                            },
                                            SourceHeaders.LCID
                                        ));
                                    }

                                    _narrowBySections[i].narrowByInfos(_narrowByInfos);

                                    break;
                                }
                            }
                        }

                        _narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.CourseLevel, localizeHeader: SourceHeaders.CourseLevel }));
                        //_narrowBySections.push(new self.narrowBySection({ header: SourceHeaders.StarRating, localizeHeader: SourceHeaders.StarRating })); // Not required

                        // Sort narrowBySections by display order
                        _narrowBySections.sort(function (a, b) {
                            if (a.displayOrder() < b.displayOrder()) return -1;
                            if (a.displayOrder() > b.displayOrder()) return 1;
                            return 0;
                        });

                        self.narrowBySections([]);
                        self.narrowBySections(_narrowBySections);
                    }
                },

                /*
                    Handler for the click event of the "Reset filters" button.
                */
                resetAllFilters: function () {
                    var self = this;

                    trackSearchFiltersReset();

                    self.search(SearchEventTypes.resetFilters);
                    self.showHideFilterDropdown(null, true);
                    closePopmenus();
                },

                /*
                    Updates "count" property of all NarrowByInfos.
                */
                refreshFilters: function (searchEventType, sourceHeader) {
                    var self = this;

                    if (self.searchResults().narrowBySections.length > 0) {
                        for (var i = 0; i < self.narrowBySections().length; i++) {
                            if ((searchEventType == SearchEventTypes.reSearch)
                                || ((searchEventType == SearchEventTypes.selectCriteriaRemoved || searchEventType == SearchEventTypes.selectCriteriaApplied) && self.narrowBySections()[i].header() !== sourceHeader)
                                || self.narrowBySections()[i].selectedNarrowByInfosCount() == 0) {
                                for (var j = 0; j < self.searchResults().narrowBySections.length; j++) {
                                    if (self.narrowBySections()[i].header() != SourceHeaders.LCID) // Language is never updated.
                                    {
                                        if (self.narrowBySections()[i].header() == self.searchResults().narrowBySections[j].header) {
                                            if (sourceHeader == SourceHeaders.TechnologiesCategory && self.searchResults().narrowBySections[j].header == SourceHeaders.Technologies) {
                                                // Add new narrowByInfos to Technologies.
                                                _narrowByInfos = Array();
                                                for (var k = 0; k < self.searchResults().narrowBySections[j].narrowByInfos.length; k++) {
                                                    _narrowByInfos.push(new self.narrowByInfo(self.searchResults().narrowBySections[j].narrowByInfos[k], self.searchResults().narrowBySections[j].header));
                                                }
                                                self.narrowBySections()[i].narrowByInfos(_narrowByInfos);
                                            }
                                            else {
                                                // Update "count" property.
                                                for (var k = 0; k < self.narrowBySections()[i].narrowByInfos().length; k++) {
                                                    self.narrowBySections()[i].narrowByInfos()[k].count(0);

                                                    for (var l = 0; l < self.searchResults().narrowBySections[j].narrowByInfos.length; l++) {
                                                        if (self.narrowBySections()[i].narrowByInfos()[k].name() == self.searchResults().narrowBySections[j].narrowByInfos[l].name)
                                                            self.narrowBySections()[i].narrowByInfos()[k].count(self.searchResults().narrowBySections[j].narrowByInfos[l].count);
                                                    }
                                                }
                                            }

                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                /*
                    Show/hide sort options dropdown.
                */
                showSortOptions: function (element, event) {
                    var self = this;
                    var sortMenu = $(".sort-dropdown-menu");
                    if (sortMenu.length > 0) {
                        if (sortMenu.css("display") == "none") {
                            if ($(window).width() <= Configurations.mobileResolution) showPopupBackground();
                            sortMenu.show();
                        }
                        else {
                            sortMenu.hide();
                            if ($(window).width() <= Configurations.mobileResolution) hidePopupBackground();
                        }
                    }
                },

                setAriaAttributesClosed: function (triggerElement) {
                    triggerElement.each(function (index, element) {
                        $(element).attr('aria-expanded', 'false');
                        $(element).attr('aria-selected', 'false');
                        $('#' + $(element).attr('aria-controls')).attr('aria-hidden', 'true');
                    });
                },

                setAriaAttributesOpened: function (triggerElement) {
                    triggerElement.each(function (index, element) {
                        $(element).attr('aria-expanded', 'true');
                        $(element).attr('aria-selected', 'true');
                        $('#' + $(element).attr('aria-controls')).attr('aria-hidden', 'false');
                    });
                },

                /*
                    Hide filter panel.
                */
                hideFilters: function (data, hideAll) {
                    var self = this;

                    if (hideAll) {
                        $('.mlx-dropdown.mlx-drop-source').hide();
                        self.setAriaAttributesClosed($('.mlx-wrapper a'));//close all 

                        for (var i = 0; i < self.narrowBySections().length; i++)
                            self.narrowBySections()[i].isDropdownOpened(false);
                    }
                    else {
                        //clicked outside dropdown
                        if (data == null) {
                            $('div[id^="filter-dropdown-"]').each(function (index, element) {

                                var childrenSource = $(element).next('.mlx-dropdown-container').children('.mlx-drop-source');
                                var childrenTarget = $(element).next('.mlx-dropdown-container').children('.mlx-drop-target');
                                var label = $(element).children('label');

                                if (childrenSource.css('display') != "none") {
                                    childrenSource.hide();
                                    label.css('color', '');
                                }
                                childrenTarget.show();
                            });

                            for (var i = 0; i < self.narrowBySections().length; i++)
                                self.narrowBySections()[i].isDropdownOpened(false);

                            self.setAriaAttributesClosed($('.mlx-wrapper a'));//close all 
                        }
                        else {
                            var element = $("#filter-dropdown-" + data.header());
                            var childrenSource = element.next(".mlx-dropdown-container").children(".mlx-drop-source");
                            var childrenTarget = element.next(".mlx-dropdown-container").children(".mlx-drop-target");
                            var label = element.children("label");

                            if (childrenSource.css("display") === "none") {
                                data.isDropdownOpened(true);
                                console.log(data);
                                childrenSource.show();
                                label.css("color", "#333333");
                                childrenTarget.hide();

                                self.setAriaAttributesOpened($("#filter-dropdown-" + data.header() + ' a'))
                            }
                            else {
                                data.isDropdownOpened(false);
                                childrenSource.hide();
                                label.css("color", "");
                                childrenTarget.show();
                                self.setAriaAttributesClosed($("#filter-dropdown-" + data.header() + ' a'));//close all 
                            }
                        }
                    }
                },

                /*
                    Adds Course to a Learning Plan.
                */
                applyLearningPlan: function (data, index) {
                    var self = this;

                    var lpListUpdated = new Array();
                    var isInAnyLP = false;
                    var courseList = [];
                    var addedLearningPlansList = [];
                    var removedLearningPlansList = [];
                    var coursesExceededLearningPlans = [];
                    courseList.push(data.courseId());
                    var languageCode = data.LanguageCode();
                    if (self.finalUserLearningPlans().length == 0) {
                        $.extend(self.finalUserLearningPlans(), data.courseLearningPlans());
                    }
                    for (var i = 0; i < data.courseLearningPlans().length; i++) {
                        var lp = data.courseLearningPlans()[i];
                        var finallp = ko.utils.arrayFirst(self.finalUserLearningPlans(), function (item) {
                            return lp.id === item.id;
                        });
                        var lpNew;
                        var newLp;
                        if (!lp.containsCourse && $('#' + lp.id + '-' + index).prop("checked") === true) {
                            if (finallp.totalCourses >= 10) {
                                coursesExceededLearningPlans.push(lp.id);
                                $('#' + lp.id + '-' + index).attr('checked', false);

                                lpNew = { id: lp.id, name: lp.name, containsCourse: lp.containsCourse, totalCourses: lp.totalCourses };
                                lpListUpdated.push(lpNew);
                            }
                            else {
                                // Add course to LP
                                addedLearningPlansList.push(lp.id);

                                lpNew = { id: lp.id, name: lp.name, containsCourse: true, totalCourses: lp.totalCourses + 1 };
                                lpListUpdated.push(lpNew);
                                var lpold = ko.utils.arrayFirst(self.finalUserLearningPlans(), function (item) {
                                    return lp.id === item.id;
                                });
                                newLp = { id: lp.id, name: lp.name, containsCourse: true, totalCourses: lpold.totalCourses + 1 };
                                self.finalUserLearningPlans.remove(lpold);
                                self.finalUserLearningPlans.push(newLp);
                                isInAnyLP = true;

                                // Tracking
                                trackSearchResultsAddToLearningPlan(lp.name, data.courseName(), data.Id());
                            }
                        }
                        else if (lp.containsCourse && $('#' + lp.id + '-' + index).prop('checked') === false) {
                            // Remove course from LP
                            removedLearningPlansList.push(lp.id);

                            lpNew = { id: lp.id, name: lp.name, containsCourse: false, totalCourses: lp.totalCourses - 1 };
                            lpListUpdated.push(lpNew);
                            var lpold = ko.utils.arrayFirst(self.finalUserLearningPlans(), function (item) {
                                return lp.id === item.id;
                            });
                            newLp = { id: lp.id, name: lp.name, containsCourse: false, totalCourses: lpold.totalCourses - 1 };
                            self.finalUserLearningPlans.remove(lpold);
                            self.finalUserLearningPlans.push(newLp);
                        }
                        else {
                            lpNew = { id: lp.id, name: lp.name, containsCourse: lp.containsCourse, totalCourses: lp.totalCourses };
                            lpListUpdated.push(lpNew);
                        }

                        if (lpNew.containsCourse)
                            isInAnyLP = true;
                    }

                    if ((data.isUserMigrated() && data.isMigrationStarted()) || (data.isMigrationCompleted() && MLX.context.currentUser.currentUserId > 0)) {
                        if (addedLearningPlansList.length > 0) {
                            self.showListViewLoading(true);
                            self.learningPlanModel.AddCoursesToUserLearningPlans(courseList, addedLearningPlansList, languageCode).done(function () {
                                logActivity = {
                                    idCountry: Configurations.idCountry,
                                    countryCode: MLX.context.currentUser.CountryCode,
                                    idUser: MLX.context.currentUser.currentUserId,
                                    eventType: 1,
                                    idLiveEvent: null,
                                    idCourse: courseList[0],
                                    userGuid: null,
                                    courseLanguageCode: languageCode,
                                    courseVersion: data.courseVersion()
                                };

                                var json = JSON.stringify(logActivity);
                                var url = "https://" + Configurations.mvaApiTargetHostname + "/api/logActivity";
                                $.ajax({
                                    url: url,
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    type: 'POST',
                                    data: json,
                                    success: function (msg) {
                                    },
                                    error: function (msg) {
                                    }
                                });
                                self.showListViewLoading(false);
                                if (removedLearningPlansList.length) {
                                    self.learningPlanModel.DeleteCoursesFromUserLearningPlans(courseList, removedLearningPlansList, languageCode).done(function () {
                                        self.showListViewLoading(false);
                                    });
                                }
                                else {
                                    self.showListViewLoading(false);
                                }

                            });
                        }
                        else if (removedLearningPlansList.length) {
                            self.showListViewLoading(true);
                            self.learningPlanModel.DeleteCoursesFromUserLearningPlans(courseList, removedLearningPlansList, languageCode).done(function () {
                                self.showListViewLoading(false);
                            });
                        }
                    }
                    else {
                        if (addedLearningPlansList.length > 0) {
                            self.showListViewLoading(true);

                            learningPlanWrapper = {
                                destinationLearningPlanIds: addedLearningPlansList,
                                CourseId: courseList[0],
                                UserId: Configurations.UserId,
                                LanguageCode: languageCode
                            };

                            var json = JSON.stringify(learningPlanWrapper);
                            var url = "https://" + Configurations.mvaApiTargetHostname + "/api/learningPlan/add";
                            $.ajax({
                                url: url,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                type: 'POST',
                                data: json,
                                success: function (msg) {
                                    if (removedLearningPlansList.length) {
                                        learningPlanRemoveWrapper = {
                                            destinationLearningPlanIds: removedLearningPlansList,
                                            CourseId: courseList[0],
                                            UserId: Configurations.UserId,
                                            LanguageCode: languageCode
                                        };

                                        var jsonDelete = JSON.stringify(learningPlanRemoveWrapper);
                                        var urlDelete = "https://" + Configurations.mvaApiTargetHostname + "/api/learningPlan/remove";

                                        $.ajax({
                                            url: urlDelete,
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            type: 'POST',
                                            data: jsonDelete,
                                            success: function (msg) {
                                                self.showListViewLoading(false);
                                            },
                                            error: function (msg) {
                                                self.showListViewLoading(false);
                                            }
                                        });
                                    }
                                    else {
                                        self.showListViewLoading(false);
                                    }
                                },
                                error: function (msg) {
                                    self.showListViewLoading(false);
                                }
                            });
                        }
                        else if (removedLearningPlansList.length) {
                            self.showListViewLoading(true);
                            learningPlanRemoveWrapper = {
                                destinationLearningPlanIds: removedLearningPlansList,
                                CourseId: courseList[0],
                                UserId: Configurations.UserId,
                                LanguageCode: languageCode
                            };

                            var jsonDelete = JSON.stringify(learningPlanRemoveWrapper);
                            var urlDelete = "https://" + Configurations.mvaApiTargetHostname + "/api/learningPlan/remove";

                            $.ajax({
                                url: urlDelete,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                type: 'POST',
                                data: jsonDelete,
                                success: function (msg) {
                                    self.showListViewLoading(false);
                                },
                                error: function (msg) {
                                    self.showListViewLoading(false);
                                }
                            });
                        }
                    }

                    data.courseLearningPlans(lpListUpdated);
                    data.isInLearningPlan(isInAnyLP);

                    closePopmenus();

                    if (coursesExceededLearningPlans.length > 0) {
                        showMigrationPopUp('popUpToShowCourseRemoveAlert')
                    }
                },

                /*
                    Sets the given sort order value.
                */
                setSortCriteria: function (sortOnField, sortOrder) {
                    var self = this;
                    self.searchModel.inputRequest.SortOptions = [{
                        SortOnField: sortOnField,
                        SortOrder: sortOrder
                    }];
                },

                /*
                    Fires when the state of a NarrowByInfo checkbox changes.
                */
                setSelectItem: function (data) {
                    var self = this;

                    var element = $("#mvadropdown_" + data.friendlyName);

                    // Disables all checkboxes  
                    self.disableCheckBoxes();

                    if (!self.isSearching()) {
                        if (element.length > 0) {
                            if (element.prop("checked") === true) {
                                // Adds item as selectCriteriaItem
                                var _selectCriteriaItems = self.selectCriteriaItems();
                                _selectCriteriaItems.push({ SelectOnField: data.parentHeader(), SelectTerm: data.name(), SelectMatchOption: self.searchModel.MatchOption.Equal });
                                self.selectCriteriaItems(_selectCriteriaItems);

                                // Sets property isSelected as true for the current item
                                data.isSelected(true);

                                // Adds Language preference to user-data cookie
                                if (data.parentHeader() == SourceHeaders.LCID)
                                    self.setLanguagePreference(data.name());

                                // Enable or disable Technologies
                                if (data.parentHeader() == SourceHeaders.TechnologiesCategory)
                                    self.enableDisableTechnologies();

                                var filterProduct;
                                var filterProductVersion;
                                var filterTopic;
                                var filterLevel;
                                var filterJobFunction;
                                var filterLanguage;

                                for (var i = 0; i < _selectCriteriaItems.length; i++) {
                                    switch (_selectCriteriaItems[i].SelectOnField) {
                                        case SourceHeaders.TechnologiesCategory:
                                            filterProduct = self.processFilterForTracking(filterProduct, _selectCriteriaItems[i].SelectTerm); break;
                                        case SourceHeaders.Technologies:
                                            filterProductVersion = self.processFilterForTracking(filterProductVersion, _selectCriteriaItems[i].SelectTerm); break;
                                        case SourceHeaders.Topics:
                                            filterTopic = self.processFilterForTracking(filterTopic, _selectCriteriaItems[i].SelectTerm); break;
                                        case SourceHeaders.CourseLevel:
                                            filterLevel = self.processFilterForTracking(filterLevel, _selectCriteriaItems[i].SelectTerm); break;
                                        case SourceHeaders.Audiences:
                                            filterJobFunction = self.processFilterForTracking(filterJobFunction, _selectCriteriaItems[i].SelectTerm); break;
                                        case SourceHeaders.LCID:
                                            filterLanguage = self.processFilterForTracking(filterLanguage, getLanguageNameByLCID(_selectCriteriaItems[i].SelectTerm)); break;
                                    }
                                }

                                var filterTitle;
                                var itemSelected = data.localizedName().toLowerCase();
                                switch (data.parentHeader()) {
                                    case SourceHeaders.TechnologiesCategory: filterTitle = "product"; break;
                                    case SourceHeaders.Technologies: filterTitle = "product version"; break;
                                    case SourceHeaders.Topics: filterTitle = "topic"; break;
                                    case SourceHeaders.CourseLevel: filterTitle = "level"; break;
                                    case SourceHeaders.Audiences: filterTitle = "job function"; break;
                                    case SourceHeaders.LCID: filterTitle = "language"; break;
                                }

                                trackSearchFiltersAdd(itemSelected, filterTitle, filterProduct, filterProductVersion, filterTopic, filterLevel, filterJobFunction, filterLanguage)

                                // Process search
                                self.search(SearchEventTypes.selectCriteriaApplied, data.parentHeader());
                            }
                            else {
                                self.removeSelectItem(data);
                            }
                        }
                    }

                    return true;
                },

                /*
                    Removes a NarrowByInfo from the SelectCriteria Array.
                */
                removeSelectItem: function (data, event) {
                    var self = this;

                    // Remove item as selectCriteriaItem (update current list without the unchecked item)
                    var _selectCriteriaItems = Array();
                    for (var i = 0; i < self.selectCriteriaItems().length; i++) {
                        if (self.selectCriteriaItems()[i].SelectTerm != data.name()) {
                            _selectCriteriaItems.push({
                                SelectOnField: self.selectCriteriaItems()[i].SelectOnField,
                                SelectTerm: self.selectCriteriaItems()[i].SelectTerm,
                                SelectMatchOption: self.searchModel.MatchOption.Equal
                            });
                        }
                    }

                    self.selectCriteriaItems([]);
                    self.selectCriteriaItems(_selectCriteriaItems);

                    // Set property isSelected as false for the current item
                    data.isSelected(false);

                    // Remove Language preference from user-data cookie
                    if (data.parentHeader() == SourceHeaders.LCID)
                        self.removeLanguagePreference(data.name());

                    // Enable or disable Technologies
                    if (data.parentHeader() == SourceHeaders.TechnologiesCategory) {
                        self.enableDisableTechnologies();

                        // Removes all remaining Technologies from SelectCriteriaItems (generates a new array without Technologies)
                        self.removeFromSelectCriteria(SourceHeaders.Technologies);
                    }

                    var filterProduct;
                    var filterProductVersion;
                    var filterTopic;
                    var filterLevel;
                    var filterJobFunction;
                    var filterLanguage;

                    for (var i = 0; i < _selectCriteriaItems.length; i++) {
                        switch (_selectCriteriaItems[i].SelectOnField) {
                            case SourceHeaders.TechnologiesCategory:
                                filterProduct = self.processFilterForTracking(filterProduct, _selectCriteriaItems[i].SelectTerm); break;
                            case SourceHeaders.Technologies:
                                filterProductVersion = self.processFilterForTracking(filterProductVersion, _selectCriteriaItems[i].SelectTerm); break;
                            case SourceHeaders.Topics:
                                filterTopic = self.processFilterForTracking(filterTopic, _selectCriteriaItems[i].SelectTerm); break;
                            case SourceHeaders.CourseLevel:
                                filterLevel = self.processFilterForTracking(filterLevel, _selectCriteriaItems[i].SelectTerm); break;
                            case SourceHeaders.Audiences:
                                filterJobFunction = self.processFilterForTracking(filterJobFunction, _selectCriteriaItems[i].SelectTerm); break;
                            case SourceHeaders.LCID:
                                filterLanguage = self.processFilterForTracking(filterLanguage, getLanguageNameByLCID(_selectCriteriaItems[i].SelectTerm)); break;
                        }
                    }

                    var filterTitle;
                    var itemSelected = data.localizedName().toLowerCase();
                    switch (data.parentHeader()) {
                        case SourceHeaders.TechnologiesCategory: filterTitle = "product"; break;
                        case SourceHeaders.Technologies: filterTitle = "product version"; break;
                        case SourceHeaders.Topics: filterTitle = "topic"; break;
                        case SourceHeaders.CourseLevel: filterTitle = "level"; break;
                        case SourceHeaders.Audiences: filterTitle = "job function"; break;
                        case SourceHeaders.LCID: filterTitle = "language"; break;
                    }

                    trackSearchFiltersRemove(itemSelected, filterTitle, filterProduct, filterProductVersion, filterTopic, filterLevel, filterJobFunction, filterLanguage)

                    // Process search
                    self.search(SearchEventTypes.selectCriteriaRemoved, data.parentHeader());
                },

                processFilterForTracking: function (filter, selectedTerm) {
                    filter = typeof (filter) == "undefined" ? "" : filter + ",";
                    filter += selectedTerm.toLowerCase();
                    return filter;
                },

                /*
                    Enables or disables Technologies dropdown depending on the TechnologiesCategory one.
                */
                enableDisableTechnologies: function () {
                    var self = this;

                    self.childModel.enableDisableTechnologies(self);
                },

                /* 
                    Removes all selectCriteriaItems from a given SourceHeader 
                */
                removeFromSelectCriteria: function (header) {
                    var self = this;

                    var _selectCriteriaItems = Array();

                    for (var i = 0; i < self.selectCriteriaItems().length; i++) {
                        if (self.selectCriteriaItems()[i].SelectOnField != header)
                            _selectCriteriaItems.push(self.selectCriteriaItems()[i]);
                    }

                    self.selectCriteriaItems(_selectCriteriaItems);
                },

                /*
                    Enables all checkboxes.
                */
                enableCheckBoxes: function () {
                    var self = this;

                    $(".narrowby-checkbox").removeAttr("disabled");
                },

                /*
                    Disables all checkboxes.
                */
                disableCheckBoxes: function () {
                    var self = this;

                    $(".narrowby-checkbox").attr("disabled", "true");
                },

                /*
                    Adds Language to the user-data cookie.
                */
                setLanguagePreference: function (lcid, updatedLanguagePreferences) {
                    var self = this;

                    updatedLanguagePreferences = typeof (updatedLanguagePreferences) == "undefined" ? true : updatedLanguagePreferences;

                    var userDataCookie = getUserDataCookie();
                    var languagePreferences = Array();

                    if (typeof (userDataCookie) !== "undefined") {
                        if (userDataCookie.languagePreferences !== "")
                            languagePreferences = userDataCookie.languagePreferences.split('|');

                        // Checks if value already exists
                        var valueExists = false;
                        for (var i = 0; i < languagePreferences.length; i++) {
                            if (parseInt(languagePreferences[i]) === parseInt(lcid)) {
                                valueExists = true;
                                break;
                            }
                        }

                        if (!valueExists)
                            languagePreferences.push(lcid);

                        userDataCookie.languagePreferences = languagePreferences.join('|');
                        userDataCookie.updatedLanguagePreferences = updatedLanguagePreferences;
                        saveUserDataCookie(userDataCookie);
                    }
                },

                /*
                    Removes Language from the user-data cookie.
                */
                removeLanguagePreference: function (lcid, updatedLanguagePreferences) {
                    var self = this;

                    updatedLanguagePreferences = typeof (updatedLanguagePreferences) == "undefined" ? true : updatedLanguagePreferences;

                    var userDataCookie = getUserDataCookie();
                    var languagePreferences = Array();

                    if (typeof (userDataCookie) !== "undefined") {
                        var _languagePreferences = Array();
                        if (userDataCookie.languagePreferences !== '') {
                            languagePreferences = userDataCookie.languagePreferences.split('|');
                            for (var i = 0; i < languagePreferences.length; i++) {
                                if (parseInt(languagePreferences[i]) > 0 && parseInt(languagePreferences[i]) !== parseInt(lcid))
                                    _languagePreferences.push(languagePreferences[i]);
                            }
                        }

                        userDataCookie.languagePreferences = _languagePreferences.join('|');
                        userDataCookie.updatedLanguagePreferences = updatedLanguagePreferences;
                        saveUserDataCookie(userDataCookie);
                    }
                },

                /*
                    Removes all Languages from the user-data cookie.
                */
                clearLanguagePreferences: function (lcid, userId) {
                    var self = this;

                    var userDataCookie = getUserDataCookie();
                    userDataCookie.languagePreferences = "";
                    saveUserDataCookie(userDataCookie);
                },

                /*
                    Sets the selected item.
                */
                setSelectedSortItem: function (sortItem) {
                    var self = this;
                    if (self.selectedSort() != sortItem) {
                        self.selectedSort(sortItem);
                        // Tracking
                        trackSearchResultsArrangeBy(self.selectedSort().sortName);
                        self.search(SearchEventTypes.sortOrder);
                    }
                },

                /*
                    Returns an array of LearningPlans from the current User.
                */
                getLearningPlansByUser: function () {
                    if (Configurations.UserId > 0) {
                        var self = this;
                        var learningPlansByUser = ko.observableArray();

                        for (var i = 0; i < UserLearningPlan.length; i++)
                            learningPlansByUser.push(new self.learningPlan(UserLearningPlan[i], null));

                        return learningPlansByUser();
                    }

                    return null;
                },

                /*
                    Toggle LearningPlan callout.
                */
                showAddMenu: function (data, event) {
                    var self = this;
                    if (Configurations.UserId > 0 || (Configurations.isMigrationCompleted && MLX.context.currentUser.currentUserId > 0)) {
                        var addMenu = $(event.delegateTarget).parent().find(".parent-popup");

                        if (addMenu.length > 0) {

                            var initPosition = $("footer").is(":visible") ? window.innerHeight - $("footer").height() - $(event.delegateTarget).offset().top : window.innerHeight - $(event.delegateTarget).offset().top;
                            // logic to decide whether dropdown should go down or up   
                            var $lpdropdownmenu = addMenu.find(".add-course-dropdown-items");
                            if (initPosition < parseInt($lpdropdownmenu.css('max-height'))) // offset difference should be less less than dropdown max height
                            {
                                $lpdropdownmenu.addClass("bottom100");
                                $lpdropdownmenu.css('top', 'auto');
                                var bottomVal = $(event.delegateTarget).parents().find("#coursedetails").height() + $(event.delegateTarget).parents().find("#coursedetails").offset().top + $('header').height() - $(event.delegateTarget).offset().top - ($("footer").is(":visible") ? $('footer').height() : 40) - 1;
                                if (bottomVal > $(event.delegateTarget).offset().top + $('header').height() - $(event.delegateTarget).height())
                                    bottomVal = $(event.delegateTarget).offset().top + $('header').height() - $(event.delegateTarget).height();
                                $lpdropdownmenu.css('bottom', bottomVal);
                            }
                            else {
                                $lpdropdownmenu.removeClass("bottom100");
                                var topVal = $(event.delegateTarget).offset().top - $(event.delegateTarget).parents().find("#coursedetails").offset().top + $(event.delegateTarget).height() + 1;
                                $lpdropdownmenu.css('top', topVal);
                                $lpdropdownmenu.css('bottom', 'auto');
                            }

                            if (self.finalUserLearningPlans().length > 0) {
                                var tempLearningPlans = ko.observableArray();
                                $.extend(tempLearningPlans(), data.courseLearningPlans());
                                for (var i = 0; i < self.finalUserLearningPlans().length; i++) {
                                    for (var j = 0; j < tempLearningPlans().length; j++) {
                                        if (self.finalUserLearningPlans()[i].id == data.courseLearningPlans()[j].id) {
                                            tempLearningPlans()[j].totalCourses = self.finalUserLearningPlans()[i].totalCourses;
                                        }
                                    }
                                }
                                data.courseLearningPlans([]);
                                data.courseLearningPlans(tempLearningPlans());
                            }
                        }
                        return true;
                    }
                    else {
                        event.stopPropagation();
                        showLoginPopup('popUpLoginToAddLearningPlan');
                        return false;
                    }
                },

                /*
                    Show/hide filter dropdown.
                */
                showHideFilterDropdown: function (data, hideAll) {
                    var self = this;
                    hideAll = typeof (hideAll) !== "undefined" && hideAll == true;

                    self.hideFilters(data, hideAll);
                },

                /*
                    Show/hide loading overlay.
                */
                switchOverlay: function (visible) {
                    var self = this;

                    if (visible) {
                        self.busyIndicatoroverlay.open();
                    }
                    else {
                        self.busyIndicatoroverlay.close();
                    }

                    $("#coursedetails").css("z-index", visible ? "-1" : false);
                },



                /*
                    Calculates search results container's height.
                */
                setResultsContainerHeight: function () {
                    var self = this;

                    self.childModel.setResultsContainerHeight();
                },

                /*
                    Calculates filter panel container's height.
                */
                setDivNarrowByHeight: function () {
                    var self = this;

                    self.childModel.setDivNarrowByHeight();
                },

                /*
                   Decode url for encoded more than once.
               */
                decodeURLRecursively: function (url) {
                    var self = this;
                    if (url != "") {
                        if (url.indexOf('%') != -1) {
                            try {
                                return self.decodeURLRecursively(decodeURIComponent(url));
                            }
                            catch (e) {
                                url = ""; return url;
                            }
                        }
                        if (url.match(/<\/?[^>]*>/) || url.match(/[;<>\{\}]/)) {
                            url = "";
                        }
                    }
                    return url;
                }

            };

            return cs;
    })();




