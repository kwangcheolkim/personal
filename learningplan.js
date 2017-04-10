/*
Create learner playlist view model
*/
$(function () {
    LearnerPlayListViewModel = (function () {
        var cs = function (learningPlanModel) {
            var self = this;
            self.learningPlanModel = learningPlanModel;
            self.learningPlans = ko.observableArray();
            self.coursesInProgress = ko.observableArray();
            self.coursesCompleted = ko.observableArray();
            self.initializeDeferred = undefined;
            self.itemsPerPage = ko.observable(Configurations.dashboardItemsPerPage);
            self.inProgressSkipCourses = ko.observable();
            self.completedSkipCourses = ko.observable();
            self.infiniteScrollInProgressEnabled = true;
            self.infiniteScrollCompletedEnabled = true;
            self.inProgressPageNumber = ko.observable();
            self.completedPageNumber = ko.observable();
            self.MlxAccumulatedPoints = ko.observable(0);
            self.isCreateButtonClicked = false;
            self.enrolledLearningPaths = ko.observableArray(); //General Learning paths
            self.kipiLearningPaths = ko.observableArray(); //Kipi Learning Paths
            self.learningPathModel = new microsoft.learning.mlx.LearningPathModel();
            self.userEarnedRewards = ko.observableArray();
            self.sliderEarnedBadges = undefined;
        };

        cs.prototype = {

            /*
              Fires the first time User enter the page.
            */
            initialize: function () {
                var self = this;
                self.initializeDeferred = $.Deferred();

                $(document).ready(function () {
                    $('#lbtnNewLearningPlan').show();
                    $("input[id$='ButtonMLXNewLearningPlan']").on('click', function () {
                        self.createLearningPlan();
                        return false;
                    });

                    $("a[id$='lbtnRemove']").on('click', function () {
                        disablePopup($('.popUpToRemoveLearningPlanAndNotification'));
                        self.removeItems();
                    });
                    $("a[id$='yesmlx']").on('click', function () {
                        disablePopup($('.popUpToRemoveCourseNotification'));
                        self.removeItems();
                    });

                    // INFINITE SCROLL
                    $('#divInProgressCourses').scroll(function () {
                        if (self.infiniteScrollInProgressEnabled) {
                            if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 5)) {
                                self.getTotalInProgressCourseTemplate();
                            }
                        }
                    });

                    // INFINITE SCROLL
                    $('#divCompletedCourses').scroll(function () {
                        if (self.infiniteScrollCompletedEnabled) {
                            if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 5)) {
                                self.getTotalCompletedCoursesTemplate();
                            }
                        }
                    });                    
                });
               
                self.initializeDeferred.resolve();
                return self.initializeDeferred.promise();
            },

            removeItems: function () {
                var self = this;
                var clickEventType = $("input[id$='HiddenFieldForClick']").val();
                if (clickEventType != null)
                {
                    disablePopup($('.popUpToRemoveLearningPlanAndNotification'));
                    disablePopup($('.popUpToRemoveCourseNotification'));
                    if (clickEventType == "removeLearningplanFromList")
                    {
                        self.deleteLearningPlan();
                    }
                    else if (clickEventType == "removeCourseFromList")
                    {
                        self.deleteLearningPlanItem();
                    }
                    else if (clickEventType == "removeCourseFromMyCourse") {
                        self.deleteCourse();
                    }
                }
            },

            /*
            Create learning plan object
            */
            personallearningplan: (function () {
                var self = undefined;

                var obj = function personallearningplan(learningPlanName, learningPlanId) {
                    self = this;
                    self.UserLearningPlanID = learningPlanId;
                    self.UserLearningPlanName = learningPlanName;
                    self.UserID = null;
                    self.UserLearningPlanProducts = [];
                    self.CreateDatetime = new Date().toString();
                    self.ChangeDatetime = new Date().toString();
                    self.CreatedByMLXUserID = null;
                    self.UpdatedByMlxUserID = null;
                    self.IsDeleted = false;

                };
                return obj;
            })(),

            /*
            Create learning plan 
            */
            createLearningPlan: function () {
                var self = this;
                if (!self.isCreateButtonClicked)
                {
                    self.isCreateButtonClicked = true;
                    var name = $("[id*='txtNewLearningPlan']").val();
                    if (name == null || name == "")
                    {
                        self.isCreateButtonClicked = false;
                        $('#addNewLearningPlanButton').show();
                        $('#newLearningPlanPanel').hide();
                        showNotification(Configurations.invalidLearningPlanMessage, notificationTypes.ERROR);
                    }
                    else
                    {
                        if (!name.match("&#"))
                        {
                            switchOverlay(true);
                            $('#learning-plan-accordion').accordion('destroy');
                            var learningPlan = new self.personallearningplan(name, null);
                            switchOverlay(true);
                            var promise = self.learningPlanModel.CreateUserLearningPlan(learningPlan);
                            promise.done(function (returnlearningPlan) {
                                var getpromise = self.learningPlanModel.GetUserLearningPlansForUser(MLX.context.currentUser.currentUserId);
                                getpromise.done(function (learnerPlayLists) {
                                    var lst = bindLearningPlans(learnerPlayLists);
                                    self.learningPlans([]);
                                    self.learningPlans(lst);
                                    $('input[id$="MlxLearningPlanCount"]').val(self.learningPlans().length);
                                    $("[id*='txtNewLearningPlan']").val('');
                                    $('#addNewLearningPlanButton').show();
                                    $('#newLearningPlanPanel').hide();
                                    initLearningPlanItemPanel();
                                    self.initializeDashboardAccordion();
                                    switchOverlay(false);
                                    self.isCreateButtonClicked = false;
                                }).fail(function () {
                                    self.initializeDashboardAccordion();
                                    switchOverlay(false);
                                    self.isCreateButtonClicked = false;
                                })
                            });
                        }
                        else
                        {
                            switchOverlay(true);
                            window.location.href = homePageUrl;
                        }
                    }
                }
            },

            /*
            Delete learning plan 
            */
            deleteLearningPlan: function () {
                var self = this;
                var learningPlanId = $("input[id$='HiddenFieldRemoveLearningPlan']").val();
                self.learningPlanId = [];
                self.learningPlanId.push(learningPlanId);
                var promise = self.learningPlanModel.DeleteUserLearningPlan(self.learningPlanId);

                switchOverlay(true);
                $('#learning-plan-accordion').accordion('destroy');
                promise.done(function () {
                    self.removeLearningPlan(learningPlanId);
                    self.initializeDashboardAccordion();
                    switchOverlay(false);
                });
            },

            /*
            Delete learning plan items
            */
            deleteLearningPlanItem: function () {
                var self = this;
                var learningPlanId = $("input[id$='HiddenFieldRemoveLearningPlanItemParentId']").val();
                var languageCode = $("input[id$='HiddenFieldRemoveLearningPlanLanguageId']").val();
                self.learningPlanId = [];
                self.learningPlanId.push(learningPlanId);
                var learningPlanItemId = $("input[id$='HiddenFieldRemoveLearningPlanItemId']").val();
                self.learningPlanItemId = [];
                self.learningPlanItemId.push(learningPlanItemId);
                var promise = self.learningPlanModel.DeleteCoursesFromUserLearningPlans(self.learningPlanItemId, self.learningPlanId, languageCode);
                switchOverlay(true);
                $('#learning-plan-accordion').accordion('destroy');
                promise.done(function () {
                    //self.removeLearningPlanItem(learningPlanItemId);
                    var getpromise = self.learningPlanModel.GetUserLearningPlansForUser(MLX.context.currentUser.currentUserId);
                    getpromise.done(function (learnerPlayLists) {
                        var lst = bindLearningPlans(learnerPlayLists);
                        self.learningPlans([]);
                        self.learningPlans(lst);
                        initLearningPlanItemPanel();
                        self.initializeDashboardAccordion();
                        switchOverlay(false);
                    })
                });
            },

            /*
            Remove learning plan from ko observable
            */
            removeLearningPlan: function (learningPlanId) {
                var self = this;
                self.learningPlans.remove(function (lp) {
                    return lp.ID == learningPlanId;
                });
                $('input[id$="MlxLearningPlanCount"]').val(self.learningPlans().length);
            },

            /*
            Remove learning plan from ko observable
            */
            removeLearningPlanItem: function (learningPlanItemId) {
                var self = this;
                self.learningPlans.remove(function (lpItem) {
                    return lpItem.ID == learningPlanItemId;
                });
            },

            landingPageRedirect: function () {
                window.location.href = Configurations.KipiUrlTemplate
            },

            /*
            Update learning plan 
            */
            updateLearningPlan: function (data) {
                var self = this;                
                if (data.Name == null || data.Name == "" || (new RegExp('[<>]')).test(data.Name)) {
                    showNotification(Configurations.invalidLearningPlanMessage, notificationTypes.ERROR);
                }
                else {
                    $('#learning-plan-accordion').accordion('destroy');
                    var learningPlan = new self.personallearningplan(data.Name, data.ID);
                    if (!data.Name.match("&#")) {
                        switchOverlay(true);
                        var promise = self.learningPlanModel.UpdateUserLearningPlan(learningPlan);
                        promise.done(function (returnlearningPlan) {
                            var getpromise = self.learningPlanModel.GetUserLearningPlansForUser(MLX.context.currentUser.currentUserId);
                            getpromise.done(function (learnerPlayLists) {
                                var lst = bindLearningPlans(learnerPlayLists);
                                self.learningPlans([]);
                                self.learningPlans(lst);
                                initLearningPlanItemPanel();
                                self.initializeDashboardAccordion();
                                switchOverlay(false);
                            })
                        });
                    } else {
                        switchOverlay(true);
                        window.location.href = homePageUrl;
                    }
                }
            },

            /*
           Edit learning plan on enter key press
           */
            editOnEnter: function (d, e) {
                var self = this;
                if (e.keyCode === 13){
                    self.updateLearningPlan(d);
                    return false;
                }
                return true;
            },

            /*
            Get total tech reward points
            */
            getTotalTechRewardPoints: function () {
                var params = null;
                params = {
                    userId: MLX.context.currentUser.currentUserId
                };

                var baseURL = $('#hfBaseURL').attr("value");
                var url = baseURL + "Handlers/MlxWebMethodsHandler.aspx/GetTotalTechRewardsXPPoints";
                var promise = $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        $("#XpPoints").text(msg.d);
                        switchOverlay(false);
                    },
                    error: function (msg) {
                    }
                });
            },

            /*
            Get leader board 
            */
            getTechRewardLeaderBoard : function () {
                var params = null;
                params = {
                    userId: MLX.context.currentUser.currentUserId,
                    countryCode: MLX.context.currentUser.CountryCode
                };

                var baseURL = $('#hfBaseURL').attr("value");
                var url = baseURL + "Handlers/MlxWebMethodsHandler.aspx/GetUserLeaderBoard";
                var promise = $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                    },
                    error: function (msg) {
                        switchOverlay(false);
                    }
                });
            },

            /*
            Get Accumulated Points
            */
            getAccumulatedPoints: function () {
                var self = this;
                var userProfileModel = new microsoft.learning.mlx.UserProfileModel();
                var getPointsPromise = userProfileModel.getUserAccumulatedPoints();
                getPointsPromise.done(function (AccumulatedPoints) {
                    if (AccumulatedPoints != null) {
                        self.MlxAccumulatedPoints(AccumulatedPoints);
                        $("#mlxdivLegacyPoints").show();
                        switchOverlay(false);
                    }
                })
            },

            /*
            Get learning plans 
            */
            getLearningPlan: function () {
                var self = this;
                var getpromise = self.learningPlanModel.GetUserLearningPlansForUser(MLX.context.currentUser.currentUserId);
                getpromise.done(function (learnerPlayLists) {
                    if (learnerPlayLists.length == 0) {
                        var lpcountpromise = self.learningPlanModel.GetTotalUserLearningPlansCount(MLX.context.currentUser.currentUserId);
                        lpcountpromise.done(function (lpCount) {
                            if (lpCount == 0) {
                                var lpName = Configurations.defaultLearningPlanName;
                                var plearningPlan = {
                                    UserLearningPlanID: 0,
                                    UserLearningPlanName: lpName,
                                    UserID: null,
                                    UserLearningPlanProducts: [],
                                    CreateDatetime: new Date().toString(),
                                    ChangeDatetime: new Date().toString(),
                                    CreatedByMLXUserID: null,
                                    UpdatedByMlxUserID: null,
                                    IsDeleted: false
                                };
                                var lpcreatepromise = self.learningPlanModel.CreateUserLearningPlan(plearningPlan);
                                lpcreatepromise.done(function (createdLearningPlan) {
                                    var lpgetpromise = self.learningPlanModel.GetUserLearningPlansForUser(MLX.context.currentUser.currentUserId);
                                    lpgetpromise.done(function (learningPlansData) {
                                        var lst = bindLearningPlans(learningPlansData);
                                        self.learningPlans([]);
                                        self.learningPlans(lst);
                                        $('input[id$="MlxLearningPlanCount"]').val(self.learningPlans().length);
                                        initLearningPlanItemPanel();
                                    });
                                });
                            }
                            else {
                                var lst = bindLearningPlans(learnerPlayLists);
                                self.learningPlans([]);
                                self.learningPlans(lst);
                                $('input[id$="MlxLearningPlanCount"]').val(self.learningPlans().length);
                                initLearningPlanItemPanel();
                            }
                        });
                    }
                    else {
                        var lst = bindLearningPlans(learnerPlayLists);
                        self.learningPlans([]);
                        self.learningPlans(lst);
                        $('input[id$="MlxLearningPlanCount"]').val(self.learningPlans().length);
                        initLearningPlanItemPanel();
                    }
                    
                    self.initializeDashboardAccordion();
                });
            },

            initializeDashboardAccordion: function () {
                $.extend($.ui.accordion.prototype.options, { multiple: true });
                $.extend($.ui.accordion.prototype, {
                    _oldEventHandler: $.ui.accordion.prototype._eventHandler,
                    _eventHandler: function (event) {
                        if (event.keyCode == undefined || event.keyCode == jQuery.ui.keyCode.ENTER || event.keyCode == jQuery.ui.keyCode.BACKSPACE) {
                            if (this.options.multiple && this.element[0].id.indexOf("kipi-accordion-") == -1 && this.element[0].id.indexOf("inp-lp-inner-accordion-") == -1 && this.element[0].id.indexOf("inp-kipilp-inner-accordion-") == -1) {
                                var clicked = $(event.currentTarget), clickedIsActive = clicked.hasClass("ui-accordion-header-active");

                                var accordion = $("#" + clicked.parent().attr("id"));

                                if (clickedIsActive) {
                                    clicked.addClass("ui-corner-all").removeClass("ui-accordion-header-active ui-state-active ui-corner-top");
                                    clicked.next().removeClass("ui-accordion-content-active").hide();
                                } else {
                                    clicked.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top");
                                    clicked.next().addClass("ui-accordion-content-active").show();
                                }

                                var allActives = true;
                                $(accordion).children('span.lpAccordian').each(function () {
                                    if (!$(this).hasClass("ui-accordion-header-active")) {
                                        allActives = false;
                                    }
                                });

                                setTimeout(function () { clicked.focus(); }, 100);

                            } else {
                                this._oldEventHandler(event);
                            }
                        }
                    },
                    activateAccordionIndex: function (index) {
                        var selectedElement = this.element.find(".ui-accordion-header:eq(" + index + ")");
                        selectedElement.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top");
                        selectedElement.next().addClass("ui-accordion-content-active").show();
                    }
                });

                //Initialize learning plan accordion in dashboard page
                $('#learning-plan-accordion').accordion({
                    header: 'span.lpAccordian',
                    icons: false,
                    heightStyle: "content",
                    collapsible: true,
                    active: false
                });
            },

            /*
            Get Total InProgress courses
            */
            getTotalInProgressCourseTemplate: function () {
                var self = this;
                if (self.coursesInProgress().length == 0) {
                    self.inProgressPageNumber(1);
                    var getpromise = self.learningPlanModel.GetCoursesForUser(MLX.context.currentUser.currentUserId, 0, self.itemsPerPage(), false);
                    getpromise.done(function (Courses) {
                        var courses = bindTotalInProgressCourses(Courses);
                        if (courses.length < self.itemsPerPage()) {
                            self.infiniteScrollInProgressEnabled = false;
                        }
                        self.coursesInProgress([]);
                        self.coursesInProgress(courses);
                        if (courses.length <= 0) {
                            $('#nocourseInprogress').show();
                        }
                        initCoursesInProgress();
                    });
                }
                else {
                    self.inProgressSkipCourses(self.inProgressPageNumber() * self.itemsPerPage());
                    self.inProgressPageNumber(self.inProgressPageNumber() + 1);

                    var getpromise = self.learningPlanModel.GetCoursesForUser(MLX.context.currentUser.currentUserId, self.inProgressSkipCourses(), self.itemsPerPage(), false);
                    getpromise.done(function (Courses) {
                        var courses = bindTotalInProgressCourses(Courses);
                        if (courses.length < self.itemsPerPage()) {
                            self.infiniteScrollInProgressEnabled = false;
                        }
                        if (courses.length > 0) {
                            for (var i = 0; i < courses.length; i++) {
                                self.coursesInProgress.push(courses[i]);
                            }
                            initCoursesInProgress();
                        }
                        
                    });
                }

            },

            /*
            Get Total Completed courses
            */
            getTotalCompletedCoursesTemplate: function () {
                var self = this;
                if (self.coursesCompleted().length == 0) {
                    self.completedPageNumber(1);
                    var getpromise = self.learningPlanModel.GetCoursesForUser(MLX.context.currentUser.currentUserId, 0, self.itemsPerPage(), true);
                    getpromise.done(function (Courses) {
                        var courses = bindTotalCompletedCourses(Courses);
                        if (!(Configurations.isTranscriptEnabled && (courses.length > 0))) {
                            $("a[id$='LinkButtonDownloadTranscript']").hide();
                        }
                        if (courses.length < self.itemsPerPage()) {
                            self.infiniteScrollCompletedEnabled = false;
                        }
                        self.coursesCompleted([]);
                        if (courses.length <= 0) {
                            $('#nocourseComplete').show();
                        }
                        self.coursesCompleted(courses);
                        initCoursesComplete();
                    });
                }
                else {
                    self.completedSkipCourses(self.completedPageNumber() * self.itemsPerPage());
                    self.completedPageNumber(self.completedPageNumber() + 1);
                    var getpromise = self.learningPlanModel.GetCoursesForUser(MLX.context.currentUser.currentUserId, self.completedSkipCourses(), self.itemsPerPage(), true);
                    getpromise.done(function (Courses) {
                        var courses = bindTotalCompletedCourses(Courses);
                        if (courses.length < self.itemsPerPage()) {
                            self.infiniteScrollCompletedEnabled = false;
                        }
                        if (courses.length > 0) {
                            for (var i = 0; i < courses.length; i++) {
                                self.coursesCompleted.push(courses[i]);
                            }
                            initCoursesComplete();
                        }
                    });
                }
            },
            /*
                Get Inprogress user enrolled learning paths
           */
            getInprogressEnrolledLearningPaths: function(){
                var self = this;

                //ProgramType  1: Kipi, 2: NonKipi and 3: All
                if (self.enrolledLearningPaths().length == 0) {
                    $('#dashboard-user-enrolled-learning-path-main-container').hide();
                    $('#dashboard-user-enrolled-challenges-main-container').hide();
                    var promise = self.learningPathModel.getUserLearningPaths(3,true);
                    promise.done(function (results) {
                        if (results.length > 0) {
                            var learningPathAssets = $.grep(results, function (asset) { return asset.programType == ProgramType.LearningPath });
                            var kipiLearningProgramAssets = $.grep(results, function (asset) { return asset.programType == ProgramType.Kipi });
                            var learningPlanAssets = self.formLearningPathAssets(learningPathAssets);
                            var kipiLearningPlanAssets = self.formLearningPathAssets(kipiLearningProgramAssets);
                            self.enrolledLearningPaths([]);
                            self.kipiLearningPaths([]);
                            self.enrolledLearningPaths(learningPlanAssets);
                            self.kipiLearningPaths(kipiLearningPlanAssets);
                            $.each(self.enrolledLearningPaths(), function (i, lp) {                               
                                $('#inp-lp-inner-accordion-' + i).accordion({
                                    heightStyle: "content",
                                    collapsible: true,
                                    header: 'div.inp-lp-Accordian'
                                });
                                $('#outer-inp-lp-accordion-' + i).accordion({
                                    header: 'span.lpAccordian',
                                    icons: false,
                                    heightStyle: "content",
                                    collapsible: true,
                                    active: false
                                });
                            });

                            $.each(self.kipiLearningPaths(), function (i, lp) {
                                $('#inp-kipilp-inner-accordion-' + i).accordion({
                                    heightStyle: "content",
                                    collapsible: true,
                                    header: 'div.inp-lp-Accordian'
                                });
                                $('#outer-inp-kipilp-accordion-' + i).accordion({
                                    header: 'span.lpAccordian',
                                    icons: false,
                                    heightStyle: "content",
                                    collapsible: true,
                                    active: false
                                });
                            });

                            if (self.enrolledLearningPaths().length != 0) {
                                $('#dashboard-user-enrolled-learning-path-main-container').show();
                            }

                            if (self.kipiLearningPaths().length != 0 && Configurations.isKipiActive) {
                                $('#dashboard-user-enrolled-challenges-main-container').show();
                            }
                }
                        switchOverlay(false);
                    })
                }
            },

            gotToAccomplishmentTab: function () {
                $('.completedContent').show();
                this.getUserLearningRewards();
                $('.tabs-container').tabs({
                    active: $('#dvCompleted').index()
                });
            },
            /*
            Form learning path assets object
            */
            formLearningPathAssets: function (learningPaths) {
                var learningPathsList = [];

                $.each(learningPaths, function (i, lp) {
                    var assets = [], rewards = [];

                    
                    $.each(lp.assets, function (j, asset) {
                        assets.push({
                            id: asset.sourceId,
                            name: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].name : '',
                            imageurl: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].image : '',
                            description: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].description : '',
                            publishedDate: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].publishedDate : '',
                            level: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].level : '',
                            authorname: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].learningPathAssetAuthors[0].name : '',
                            language: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].language : '',
                            progress: (asset.progress != null) ? asset.progress : 0,
                            rating: (asset.localizedDetails.length > 0) ? ((asset.localizedDetails[0].rating) / 5) * 100 : 0,
                            ratingCount: (asset.localizedDetails.length > 0) ? asset.localizedDetails[0].ratingCount : 0
                        });
                    });

                    rewards.push({
                        evidenceURL: (lp.rewards[0].evidenceUrl != null) ? lp.rewards[0].evidenceUrl:'',
                        imageurl: (lp.rewards[0].localizedDetails.length > 0) ? lp.rewards[0].localizedDetails[0].image : '',
                        name: (lp.rewards[0].localizedDetails.length > 0) ? lp.rewards[0].localizedDetails[0].name : '',
                        description: (lp.rewards[0].localizedDetails.length > 0) ? lp.rewards[0].localizedDetails[0].description : '',
                    });

                    learningPathsList.push({
                        id: lp.id,
                        name: lp.name,
                        description: lp.localizedDetails[0].description,
                        imageurl: '/kipi_lp_' + lp.id  + '.png',
                        hours:parseInt( lp.durationInSeconds / 3600 ) % 24,
                        assets: assets,
                        rewards:rewards,
                        isEnrolled: (MLX.context.currentUser.isAuthenticated && lp.isEnrolled != 'undefined' && lp.isEnrolled) ? true : false,
                        progress: (lp.progress) ? lp.progress : 0
                    });
                });
                return learningPathsList;
            },
       
            /*
            Form and return courseplayer url
            */
            getCoursePlayerURL: function (CourseId, Title, Language) {
                return Configurations.CoursePlayerUrlTemplate
                        .replace('{Host}', window.location.host)
                        .replace('{LanguageCode}', Language)
                        .replace('{FriendlyName}', getCoursePlayerFriendlyName(CourseId, Title));
            },

            /*
            Focus selected learning path
            */
            focusContainerOnLearningPath: function (id) {
                $('html, body').animate({
                    scrollTop:  $("#hideContainer-" + id).offset().top - 50 
                }, 1000);
            },

            /*
            Register user learning path 
           */
            registerUserLearningPath: function () {
                var self = this, programType= 1;
                var learningPath = self.getLearningPathCookie();
                
                if (typeof (learningPath) !== "undefined") {

                    //ProgramType  1: Kipi and 2: general
                    programType = (learningPath.programType) ? learningPath.programType : 1;

                    if (learningPath.id !== "") {
                        var promise = self.learningPathModel.registerLearningPath(learningPath.id);
                        promise.done(function () {
                            if (programType == 1) {
                                trackKipiChallengeAccepted(learningPath.name);
                            }
                            self.deleteLearningPathCookie();
                            self.getInprogressEnrolledLearningPaths();
                        });
                    }
                } else {
                    self.getInprogressEnrolledLearningPaths();
                }
            },

            /*
            Delete learningpath cookie 
           */
            deleteLearningPathCookie: function () {
                $.cookie("learningpath", '', { expires: 1, path: '/' });
            },

            /*
            Get learningpath cookie 
           */
            getLearningPathCookie: function () {
                var learningPathCookie = $.cookie("learningpath");
                var learningPath;
                if (typeof (learningPathCookie) !== "undefined" && learningPathCookie != "") {
                    learningPath = JSON.parse(learningPathCookie);
                }
                return learningPath;
            },

            /*
            Delete course 
            */
            deleteCourse: function () {
                var self = this;
                var courseId = $("input[id$='HiddenFieldDeleteCourse']").val();
                var languageId = $("input[id$='HiddenFieldLanguageId']").val();
                var promise = self.learningPlanModel.removeCourseFromMyCourses(courseId, languageId);
                promise.done(function () {
                    self.removeCourse(courseId, languageId);
                    initCoursesInProgress();
                });
            },

            /*
           Remove course from ko observable
           */
            removeCourse: function (courseId, languageId) {
                var self = this;
                self.coursesInProgress.remove(function (course) {
                    return course.IdEducationType == courseId && course.LanguageId == languageId;
                });
            },

            getRetirementMessage: function (courseData) {
                if (courseData.IsRetired) {
                    if (courseData.IdReplacementCourse > 0) {
                        return ResourceStrings.DSH_RetirementReplace.replace('{course-link}', courseData.ReplacementCourseFriendlyNameMLX).replace("{course-name}", courseData.ReplacementCourseName);
                    }
                    else {
                        return ResourceStrings.DSH_RetiredNoReplace;
                    }
                }
                else if(courseData.IsInRetirementProcess)
                {
                    var retirementDate = new Date(courseData.RetirementDate);
                    if (!isNaN(retirementDate)) {
                        var retirementDateString = (parseInt(retirementDate.getMonth()) + 1) + '-' + retirementDate.getDate() + '-' + retirementDate.getFullYear();
                        if (courseData.IdReplacementCourse > 0) {
                            return ResourceStrings.DSH_RetirementNoticeScheduledAndReplaceDashboard.replace("{date}", retirementDateString).replace("{course-link}", courseData.ReplacementCourseFriendlyNameMLX).replace("{course-name}", courseData.ReplacementCourseName);
                        }
                        else {
                            return ResourceStrings.DSH_RetirementNoticeScheduledDashboard.replace("{date}", retirementDateString);
                        }
                    }
                }
                return "";
            },

            /*
            Get earned rewards badges for user
            */
            getUserLearningRewards: function () {
                var self = this;
                if (self.userEarnedRewards().length == 0) {
                    $('#earnedbagescontainer').hide();
                    var promise = self.learningPathModel.getUserLearningRewards();
                    promise.done(function (results) {
                        if (results.length > 0) {
                            $('#earnedbagescontainer').show();
                            $('#badgeSection').hide();
                            $('#loadingSection').show();

                            var rewardsList = [];
                            $.each(results, function (i, rw) {
                                rewardsList.push({
                                    evidenceUrl: (rw.evidenceUrl != null) ? rw.evidenceUrl : '',
                                    imageUrl: (rw.localizedDetails.length > 0) ? rw.localizedDetails[0].image : '',
                                    name: (rw.localizedDetails.length > 0) ? rw.localizedDetails[0].name : '',
                                    issuedOn: (rw.issuedOn != null) ? $.datepicker.formatDate('dd M yy', new Date(rw.issuedOn)) : '',
                                    programType: rw.programType,
                                    trackingFunction: (rw.localizedDetails.length > 0) ? "return trackBadgeDetailsClick('" + rw.programType + "','" + rw.localizedDetails[0].name + "');" : "return trackBadgeDetailsClick('" + rw.programType + "','');"
                                });
                            });
                            self.userEarnedRewards([]);
                            self.userEarnedRewards(rewardsList);
                            if (self.userEarnedRewards().length > 3 || ($(window).width() < 767 && self.userEarnedRewards().length > 1)) {
                                self.sliderEarnedBadges = $('.bxslider').bxSlider({
                                    infiniteLoop: false,
                                    hideControlOnEnd: true,
                                    auto: false,
                                    autoControls: false,
                                    controls: true,
                                    minSlides: 1,
                                    maxSlides: 1,
                                    slideWidth: 660,
                                    pager: false,
                                    nextSelector: $('#earnedbagescontainer #next-badge'),
                                    prevSelector: $('#earnedbagescontainer #prev-badge'),
                                    nextText: '<span class="icon-right"></span>',
                                    prevText: '<span class="icon-left"></span>'
                                });
                                $('#overlay-container').addClass("position-override");
                            }

                            var totalImages = $(".badgetilesection .img").length;
                            totalImages = (totalImages > 3) ? 3 : totalImages;
                            var iLoaded = 0;
                            $(".badgetilesection .img").each(function () {
                                $(this).on("load", function () {
                                    iLoaded++;
                                    if (iLoaded == totalImages) {
                                        $('#loadingSection').hide();
                                        $('#badgeSection').show();
                                    }
                                }).on("error", function () {
                                    $('#loadingSection').hide();
                                    $('#badgeSection').show();
                                });
                            });
                        }
                    })
                }
            }
        };

        return cs;
    })();

});

/*
Bind learning plans to memory cache
*/
var bindLearningPlans = function (learnerPlayLists) {
    var self = this;
    learnerPlans = [];
    $.each(learnerPlayLists, function (i, lpList) {
        var lpListItems = [];
        $.each(lpList.items, function (j, item) {
            lpListItems.push({
                ID: item.id,
                Name: item.name,
                Progress: item.progress,
                ListOrder: item.listOrder,
                FriendlyName: item.friendlyName,
                IdMLX: item.idmlx,
                LanguageCodeMLX: item.languageCodeMLX,
                FriendlyNameMLX: learnerPlayerURL(item.languageCodeMLX, getCoursePlayerFriendlyName(item.id, item.name)),
                Type: 0,
                UsePlayerMLX: true,
                IsActive: item.isActive,
                AddedOn: "2012-02-14"
            });
        });
        learnerPlans.push({
            ID: lpList.id,
            Name: lpList.name,
            ListOrder: 0,
            Items: lpListItems
        });
    });
    return learnerPlans;
};

var closelpAlert = function (e) {

    var idUser = MLX.context.currentUser.currentUserId;
    var idNotification = 'notification-first';
    $("#notification-first").slideUp(1000);

    var cookieName = 'dismissDashboardLpAlert-' + idUser;

    value = getValueFromCookie(cookieName);

    if (value == "") {
        value = ",";
    }
    value += idNotification + ",";

    //Saves a cookie for the next times the user enters the dashboard
    document.cookie = cookieName + "=" + value + "; domain=" + window.location.host + "; path=/; expires=Wed, 1 Jan 2020 00:00:00 UTC;";
    return false;
};

var hasAlertCookie = function () {

    var idUser = MLX.context.currentUser.currentUserId;
    var idNotification = 'notification-first';
    $("#notification-first").slideUp(1000);

    var cookieName = 'dismissDashboardLpAlert-' + idUser;

    value = getValueFromCookie(cookieName);
    if (value != ",notification-first,") {
        $("#notification-first").show();
    }

};

var bindTotalCompletedCourses = function (Courses)
{
    var self = this;
    var completed = [];
  
    $.each(Courses, function (i, course) {
        completed.push({
            IdEducationType: course.id,
                Name: course.name,
                FriendlyName: course.friendlyName,
                IsInRetirementProcess: (!course.isRetired && course.retirementTime!=null),
                IsRetired: course.isRetired,
                RetirementDate: course.retirementTime,
                IdReplacementCourse: course.replacementCourse.courseId,
                Discriminator: 'Course',
                Progress: (course.progress != 100 && course.isCompleted) ? 100 : course.progress,
                ShowDashboardNotification: course.showDashboardNotification,
                IdMLX: course.id,
                FriendlyNameMLX: learnerPlayerURL(course.languageCodeMLX, getCoursePlayerFriendlyName(course.id, course.name)),
                LanguageCodeMLX: course.languageCodeMLX,
                UsePlayerMLX: true,
                ReplacementCourseName: course.replacementCourse.courseName,
                ReplacementCourseFriendlyName: '',
                ReplacementCourseIdMLX: course.replacementCourse.courseId,
                ReplacementCourseUsePlayerMLX: false,
                ReplacementCourseFriendlyNameMLX: (course.replacementCourse.courseId>0)? learnerPlayerURL(course.replacementCourse.languageCode, getCoursePlayerFriendlyName(course.replacementCourse.courseId, course.replacementCourse.courseName)) : '',
                ReplacementCourseLanguageCodeMLX: course.replacementCourse.languageCode,
                FinishedOn: course.completedOn,
                IsRemoved: false,
                LanguageId: course.languageId,
                CourseVersion: course.courseVersion
            });
    });

    return completed;
};

var bindTotalInProgressCourses = function (Courses) {
    var self = this;
    var inProgress = [];
    $.each(Courses, function (i, course) {
        inProgress.push({
                IdEducationType: course.id,
                Name: course.name,
                FriendlyName: course.friendlyName,
                IsInRetirementProcess: (!course.isRetired && course.retirementTime!=null),
                IsRetired: course.isRetired,
                RetirementDate: course.retirementTime,
                IdReplacementCourse: course.replacementCourse.courseId,
                Discriminator: 'Course',
                Progress: course.progress,
                ShowDashboardNotification: course.showDashboardNotification,
                IdMLX: course.id,
                FriendlyNameMLX: learnerPlayerURL(course.languageCodeMLX, getCoursePlayerFriendlyName(course.id, course.name)),
                LanguageCodeMLX: course.languageCodeMLX,
                UsePlayerMLX: true,
                ReplacementCourseName: course.replacementCourse.courseName,
                ReplacementCourseFriendlyName: '',
                ReplacementCourseIdMLX: course.replacementCourse.courseId,
                ReplacementCourseUsePlayerMLX: false,
                ReplacementCourseFriendlyNameMLX: (course.replacementCourse.courseId > 0) ? learnerPlayerURL(course.replacementCourse.languageCode, getCoursePlayerFriendlyName(course.replacementCourse.courseId, course.replacementCourse.courseName)) : '',
                ReplacementCourseLanguageCodeMLX: course.replacementCourse.languageCode,
                FinishedOn: course.completedOn,
                IsRemoved: false,
                LanguageId: course.languageId,
                CourseVersion: course.courseVersion
            });
    });

    return inProgress;
};

/*
Get course player friendly name 
*/
var getCoursePlayerFriendlyName = function (courseId, courseName) {
    var friendlyName = courseName.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .replace('.', '-')
        .replace(',', '-');

    return friendlyName + '-' + courseId;
};

/*
Get course player friendly url 
*/
var learnerPlayerURL = function (languageCode, courseFriendlyName) {
    if (!window.location.origin)
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    return Configurations.CoursePlayerUrlTemplate
        .replace('{Host}', window.location.host)
        .replace('{LanguageCode}', languageCode)
        .replace('{FriendlyName}', courseFriendlyName);
}

/*
Ajax call to webmethod 
*/
var learnerAJAXPost = function () {
    var successFN = learnerAJAXPost.arguments[learnerAJAXPost.arguments.length - 2];
    var errorFN = learnerAJAXPost.arguments[learnerAJAXPost.arguments.length - 1];
    var baseURL = $('#hfBaseURL').attr("value");
    var url = baseURL + learnerAJAXPost.arguments[0];
    var params = learnerAJAXPost.arguments[1];
    var eventId = learnerAJAXPost.arguments[2];

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {

            switchOverlay(false);
        },
        error: function (msg) {
            errorFN(msg);
        }
    });
}

/*
Display or hide overlay 
*/
var switchOverlay = function (visible) {
    var self = this;
    if (visible) {
        $("[id*='overlay-container']").show();
    } else {
        $("[id*='overlay-container']").hide();
    }
}


/*
Display or hide overlay 
*/
var switchLeaderBoardOverlay = function (visible) {
    var self = this;
    if (visible) {
        switchOverlay(false);
        $("#leaderBoard").show();
    } else {
        $("#contentLeaderBoardTabs").html("");
        $("#leaderBoard").hide();
    }
}

/*
Remove  tags from course description
*/
var removeTagsCourseDescription = function (description) {
    if (description != null)
        var newDescription = description.replace(/(<([^>]+)>)/ig, "");

    return newDescription;
};

/*
Get level name by value
*/
var getLevelName = function (levelValue) {
    var _levelValue = parseInt(levelValue);

    if (isNaN(_levelValue)) {
        switch (levelValue) {
            case "Beginner":
                _levelValue = 100;
                break;
            case "Intermediate":
                _levelValue = 200;
                break;
            case "Advanced":
                _levelValue = 300;
                break;
            default:
                return "";
        }
    }

    if (_levelValue > 0 && CourseLevels) {
        switch (_levelValue) {
            case CourseLevels.Beginner:
                return ResourceStrings.CourseLevelBeginner;
            case CourseLevels.Intermediate:
                return ResourceStrings.CourseLevelIntermediate;
            case CourseLevels.Advanced:
                return ResourceStrings.CourseLevelAdvanced;
            case CourseLevels.Expert:
                return ResourceStrings.CourseLevelExpert;
        }
    }

    return "";
};

/*
Get published date text by date
*/
var getDateDiffString = function (sourceDate) {
    var PublishDate = sourceDate;
    var reg = /\d+/g;
    if (sourceDate == null || sourceDate == undefined) {
        return "";
    }
    if (typeof (PublishDate) === "string") {
        PublishDate = new Date(sourceDate.startsWith("/Date(") ? parseInt(reg.exec(sourceDate)) : sourceDate);
    }
    var dateMsec = PublishDate.getTime();

    // Set the unit values in milliseconds.
    var msecPerMinute = 1000 * 60;
    var msecPerHour = msecPerMinute * 60;
    var msecPerDay = msecPerHour * 24;
    var msecPerYear = 365;
    var msecPerMonth = 30;
    var msecPerWeek = 7;

    var days = 0;
    var n = 0;
    var unit = "";

    // Get the difference in milliseconds.
    var interval = new Date().getTime() - dateMsec;

    // Calculate how many days the interval contains. Subtract that
    // many days from the interval to determine the remainder.
    days = Math.floor(interval / msecPerDay);
    interval = interval - (days * msecPerDay);

    if (days >= msecPerYear) {
        n = Math.floor(days / msecPerYear);
        unit = (n > 1 ? ResourceStrings.SR_Years : ResourceStrings.SR_Year);
    }
    else if (days >= msecPerMonth) {
        n = Math.floor(days / msecPerMonth);
        unit = (n > 1 ? ResourceStrings.SR_Months : ResourceStrings.SR_Month);
    }
    else if (days >= msecPerWeek) {
        n = Math.floor(days / msecPerWeek);
        unit = (n > 1 ? ResourceStrings.SR_Weeks : ResourceStrings.SR_Week);
    }
    else if (days >= 1) {
        n = days;
        unit = (days > 1 ? ResourceStrings.SR_Days : ResourceStrings.SR_Day);
    }
    else {
        return ResourceStrings.SR_Today;
    }

    return ResourceStrings.PublishedTimeAgoTemplate
        .replace("{N}", n)
        .replace("{Unit}", unit)
        .replace("{Text}", ResourceStrings.SR_Ago);
};

/*
Set course info before download certificate 
*/
var setCourseInfo = function (data) {
    $("input[id$='hdnCourseName']").val(data.Name);
    $("input[id$='hdnIdEducationType']").val(data.IdEducationType);
    $("input[id$='hdnFinishedOn']").val(data.FinishedOn);
    $("input[id$='hdnCourseVersion']").val(data.CourseVersion);
    $("input[id$='hdnLanguageCode']").val(data.LanguageCodeMLX);

    $("input[id$='ButtonDownloadCertificate']").click();
};

/*
reinitialize for creating learningPlanModel as it becomes undefine when moved to dashboard page
*/
var reInitialize = (function () {
    var self = this;

    self.LearnerCallback = function () {
        var initScoTunnel = (function () {
            var learningPlanModel = new microsoft.learning.mlx.LearnerPlayListModel();
            var learnerPlayListViewModel = new LearnerPlayListViewModel(learningPlanModel);
            learnerPlayListViewModel.initialize().done(function () {
                ko.applyBindings(learnerPlayListViewModel, $("#dashboardPanel")[0]);
            });

            learnerPlayListViewModel.getLearningPlan();
            learnerPlayListViewModel.getTotalInProgressCourseTemplate();
            learnerPlayListViewModel.getTotalCompletedCoursesTemplate();
            learnerPlayListViewModel.registerUserLearningPath();

            hasAlertCookie();

            if (Configurations.isMigrationCompleted) {
                learnerPlayListViewModel.getAccumulatedPoints();
            }
           
            if (Configurations.enableTechrewards && Configurations.isMigrationCompleted) {
                learnerPlayListViewModel.getTechRewardLeaderBoard();
                learnerPlayListViewModel.getTotalTechRewardPoints();
            }
            $("input[id$='HiddenFieldUserDetails']").val(MLX.context.currentUser.currentUserId + "|" + MLX.context.currentUser.firstName + "|" +
                    MLX.context.currentUser.lastName + "|" + MLX.context.currentUser.CountryCode + "|" + MLX.context.currentUser.PreferredLanguage);
        });
        if (Configurations.isMigrationCompleted && MLX.context.currentUser.isAuthenticated && MLX.context.currentUser.currentUserId > 0) {
            $(".signup-button").hide();
        }

        if (Configurations.isMigrationStarted && MLX.context.currentUser.currentUserId > 0 && !Configurations.isMigrationCompleted) {
            SaveAnonymousUserDetailsInTableStore();
            //If user logged in from course player page, need to check for free actions and merge with Profiled user
            mergeAnonymousActivitiesMigratedUser(initScoTunnel);
        }
        else {
            initScoTunnel();
        }
    }


    MLX.init({
        appId: 'B070D012-336A-491C-BE58-04C64086F1D0',
        apiHost: Configurations.mlxApiTargetHostname,
        isAdmin: false,
        isAnonymousTenant: true
    }).done(function () {
        var AnonGUID = getAnonGUID();
        if (AnonGUID != "") {
            MLX.setAnonymousCookie(getAnonGUID());
        }

        var profileInitializerViewModel = new ProfileInitializerViewModel();
        profileInitializerViewModel.initialize().done(function () {
            if (Configurations.isMigrationCompleted) {
                $(".username").text($("#userName").text());
                $(".username").attr("aria-label", $("#userName").text() + " Profile");
            }
            if ((Configurations.UserId > 0 && Configurations.isMigrationStarted && Configurations.isMigratedUser) || Configurations.isMigrationCompleted) {
                var homeRealm = "uri:MicrosoftAccount";
                if (!MLX.context.currentUser.isAuthenticated) {
                    if (Configurations.isMigrationCompleted) {
                        window.location.href = homePageUrl;
                    }
                    MLX.signIn(undefined, homeRealm, window.location, true, self.LearnerCallback);
                } else {
                    self.LearnerCallback();
                }
            }
        });
               
    });

})

if ((Configurations.isMigratedUser && Configurations.isMigrationStarted) || Configurations.isMigrationCompleted) {
    if (PageLoadTrackingOptions.PageName.split('|')[1] == "dashboard") {
        switchOverlay(true);
        MLX.loadBundles({ bundles: ["coreapi", "webtrends", "learnerapi"], version: "1.0.0.0", debug: !1, loadDefaultBundles: !1, bundleLoadedCallback: reInitialize });
    }
}