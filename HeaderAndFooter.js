var microsoft = microsoft || {};
microsoft.learning = microsoft.learning || {};
microsoft.learning.mlx = microsoft.learning.mlx || {};


define(["jquery", "jqueryui", "jquerywidget"], function ($) {

    microsoft.learning.mlx.HeaderAndFooter = (function () {
        var hf = function () {

            var self = this;
            self.mediaQuerieMobile = 768;
            self.mediaQuerieDesktop = 1300;
            self.lastWidth = -1;
            self.actualWidth = 0;
            self.isResponsive = true;
            self.quickSearchboxMobileEnabled = false;


        };

        hf.prototype = {

            init: function ( parent ) {

                parent.actualWidth = window.innerWidth;
                parent.initializeMenu();
                parent.initializeFooter();
                parent.resizePopUps();

                $(window).resize(function (parent) {
                    parent.lastWidth = actualWidth;
                    parent.actualWidth = window.innerWidth;

                    parent.initializeMenu();
                    parent.initializeFooter();
                    parent.resizePopUps();
                });

                $('.topics-list').bind('click tap touchstart', function () {
                    $(parent).css({ "overflow-y": 'auto' });
                });

                $('.topics-list').bind('touchend', function () {
                    $(parent).css({ "overflow-y": '' });
                });

                parent.popUpMenus();


                $('.acc-courses').after('<div class="accordion3">' + $('#tab-courses').html() + '</div>');
                $('.acc-learningtracks').after('<div class="accordion3">' + $('#tab-learningtracks').html() + '</div>');
                $('.acc-liveevents').after('<div class="accordion3">' + $('#tab-liveevents').html() + '</div>');
                $('.acc-books').after('<div class="accordion3">' + $('#tab-books').html() + '</div>');
                $('.accordion .list-container:not(.MPSBanner)').each(function (i) {
                    $(this).replaceWith($(this).html());
                });

                $('.accordion .booksTitle').remove();

                //Disable key press event when search box is empty.

                if (typeof (SearchResultsPage) === "undefined") {
                    $('.quicksearchbox').keyup(function (e) {
                        $('input[id$=HiddenFieldTxtQuery]').val(encodeURIComponent($('input[id$=txtQuery]').val().trim()));
                        if (e.which == 13) { // Enter key
                            $('.search-box-image').click();
                        }
                    });

                    // Copy value to hidden field
                    $('.quicksearchbox').on('input', function (e) {
                        $('input[id$=HiddenFieldTxtQuery]').val(encodeURIComponent($('input[id$=txtQuery]').val().trim()));
                    });
                    $('.quicksearchbox').on('change', function (e) {
                        $('input[id$=HiddenFieldTxtQuery]').val(encodeURIComponent($('input[id$=txtQuery]').val().trim()));
                    });

                    $('.quicksearchbox').keydown(function (e) {
                        $('input[id$=HiddenFieldTxtQuery]').val(encodeURIComponent($('input[id$=txtQuery]').val().trim()));
                    });

                    $('.quicksearchbox').keypress(function () {
                        $('input[id$=HiddenFieldTxtQuery]').val(encodeURIComponent($('input[id$=txtQuery]').val().trim()));
                    });
                }


                $('.tabs').tabs();
                $('.accordion').accordion({
                    header: 'span.accordian:not(.ignore)',
                    icons: false,
                    heightStyle: "content",
                    collapsible: true,
                    active: false
                });

                $('.accordion3').accordion({
                    header: 'span.accordian3:not(.ignore)',
                    icons: false,
                    heightStyle: "content",
                    collapsible: true,
                    active: false
                });



                //[Start] search auto complete
                //$.widget("custom.catAutocomplete", $.ui.autocomplete, {
                //    _renderMenu: function (ul, items) {
                //        var that = this,
                //            currentCategory = "";
                //        $.each(items, function (index, item) {
                //            if (item.category != currentCategory) {
                //                ul.append("<li class='ui-menu-item-font' >" + item.category + " </li>");
                //                currentCategory = item.category;
                //            }
                //            that._renderItemData(ul, item);
                //        });
                //    },
                //    _renderItem: function (ul, item) {
                //        var wordRegEx = new RegExp('(' + $('.quicksearchbox').val() + ')', 'gi');
                //        if (item.category != "Courses") {
                //            return $("<li>").append('<a href="#" title="' + item.value + '" onclick="trackRecommendSearchTerm(\'' + item.category + '\',\'' + item.value + '\')" >' + item.label.replace(wordRegEx, '<span>$1</span>') + '</a>')
                //                .appendTo(ul);
                //        }
                //        else {
                //            var url = "/" + item.lgCode + "/training-courses/" + getCoursePlayerFriendlyName(item.id.trim(), item.value.trim()) + '';
                //            return $('<li>')
                //                 .append('<a href=' + url + ' title="' + item.value + '" onclick="trackRecommendSearchTerm(\'' + item.category + '\',\'' + item.value + '\')" >' + item.value.replace(wordRegEx, '<span>$1</span>') + '</a></li>')
                //                 .appendTo(ul);
                //        }
                //    }
                //});



                //$('.quicksearchbox').keydown(function (event) {
                //    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
                //        event.preventDefault();
                //    }
                //});

                //$('.quicksearchbox').focus(function () {
                //    if ($('.quick-search-carot.pop-content').css("display") == "none") {
                //        closePopmenus();
                //    }
                //});

                //var getCoursePlayerFriendlyName = function (courseId, courseName) {
                //    var friendlyName = courseName.toLowerCase()
                //        .replace(/[^\w ]+/g, '')
                //        .replace(/ +/g, '-')
                //        .replace('.', '-')
                //        .replace(',', '-');

                //    return friendlyName + '-' + courseId;
                //};



                //$('.quicksearchbox').catAutocomplete({
                //    source: function (request, response) {

                //        params = {
                //            searchTerm: request.term,
                //            lcids: (PageLoadTrackingOptions.PageName.indexOf("search") > -1 || PageLoadTrackingOptions.PageName.indexOf("topics") > -1) ? searchViewModel.userLanguagePreferences().join(',') : lcid
                //        };
                //        var baseURL = $('#hfBaseURL').attr("value");
                //        var url = baseURL + "Handlers/MlxWebMethodsHandler.aspx/GetSearchTermResults";
                //        var promise = $.ajax({
                //            type: 'POST',
                //            url: url,
                //            data: JSON.stringify(params),
                //            contentType: "application/json; charset=utf-8",
                //            dataType: "json",
                //            success: function (msg) {
                //                response($.map(msg.d, function (item) {
                //                    return {
                //                        name: item.CourseName,
                //                        id: item.CourseId,
                //                        lgCode: item.LanguageCode,
                //                        value: item.Term,
                //                        label: item.Term,
                //                        category: item.Category
                //                    }
                //                }));
                //            },
                //            error: function (msg) {
                //            },
                //            beforeSend: function () { $('#header .quick-search-box .search-box-query .search-box-image').addClass('loading'); },
                //            complete: function () { $('#header .quick-search-box .search-box-query .search-box-image').removeClass('loading'); }
                //        });

                //        if (PageLoadTrackingOptions.PageName.indexOf("courses") > -1) {
                //            courseViewModel.busyIndicatoroverlay.close();
                //        }
                //    },
                //    minLength: 3,
                //    delay: 500,
                //    focus: function () {
                //        // prevent value inserted on focus
                //        return false;
                //    },
                //    select: function (event, ui) {
                //        var terms = [];
                //        terms.push(ui.item.value.trim()); // add completed item
                //        this.value = terms.join(" ");
                //        if (event.type == "catautocompleteselect" && ui.item.category == "Products and Topics") {
                //            if (PageLoadTrackingOptions.PageName.indexOf("search") > -1) {
                //                searchViewModel.search(SearchEventTypes.searchBox);
                //            } else {
                //                window.location.href = getURL() + "?q=" + this.value;
                //            }
                //        };
                //        return false;
                //    },

                //});


                //var getURL = function () {
                //    if (!window.location.origin)
                //        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                //    return SearchResultsUrlTemplate.replace('{Host}', window.location.host);
                //}
                //[End] search auto complete


            }, // end of init

            resizePopUps: function () {

                $("#header-courses").height("");
                $(".footerPopUp").height("");
                $(".footerPopUpContainer").height("");

                if ($(window).width() < this.mediaQuerieMobile) {
                    if ($(window).height() < $("#header-courses").height() + $("header").height()) {
                        var newHeight = $(window).height() - ($("header").height());
                        $("#header-courses").height(newHeight);
                    }

                    if ($(window).height() < $(".footerPopUp").height() + $("header").height()) {

                        var newfooterPopUpHeight = $(window).height() - ($("header").height());
                        var newfooterPopUpContainerHeight = newfooterPopUpHeight - $(".header-title").outerHeight();;

                        $(".footerPopUp").height(newfooterPopUpHeight);
                        $(".footerPopUpContainer").height(newfooterPopUpContainerHeight);
                    }
                }
                else {
                    if ($(window).height() < $("#header-courses").height() + $("header").height() + $(".footer-content").height()) {
                        var newHeight = $(window).height() - ($("header").height() + $(".footer-content").height());
                        $("#header-courses").height(newHeight);
                    }

                    if ($(window).height() < $(".footerPopUp").height() + $("header").height() + $(".footer-content").height()) {

                        var newfooterPopUpHeight = $(window).height() - ($("header").height() + $(".footer-content").height());
                        var newfooterPopUpContainerHeight = newfooterPopUpHeight - $(".header-title").outerHeight();;

                        $(".footerPopUp").height(newfooterPopUpHeight);
                        $(".footerPopUpContainer").height(newfooterPopUpContainerHeight);
                    }
                }

                if ($(window).width() > this.mediaQuerieDesktop) {
                    $("#courses-left-menu-accordion").hide();
                    $("#courses-left-menu-accordion").attr("aria-hidden", "true");
                    $(".list-container.collapsed").attr("aria-hidden", "true");
                    $(".list-container.collapsed").text("");

                }
                else {
                    $("#courses-left-menu-accordion").show();
                    $(".see-all.callout").attr("aria-hidden", "true");
                    $(".see-all.callout").text("");
                }

            },

           

            getURL: function () {
                if (!window.location.origin)
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                return SearchResultsUrlTemplate.replace('{Host}', window.location.host);
            },

            // close all popmenus
            closePopmenus: function () {
                self = this;
                //reset overflow from course listing if all pop-ups are closing
                $('.search-results-container').css('overflow', 'auto');

                $('.pop-menu .pop-trigger').removeClass('trigger-active').addClass('trigger-inactive').attr("aria-expanded", "false").attr("aria-selected", "false");
                $('.pop-menu .pop-content').hide().attr("aria-hidden", "true");
                self.closePopups(true, false);
            },

            // open selected popmenus
            openPopmenu: function (element) {
                //remove overflow from course search listing as it won't be required if a pop up is opened
                $('.search-results-container').css('overflow', 'hidden');


                this.showPopupBackground();
                $(element).removeClass('trigger-inactive');
                $(element).addClass('trigger-active');
                $(element).attr("aria-expanded", "true").attr("aria-selected", "true");
                $(element).closest('.pop-menu').find('.pop-content').show().attr("aria-hidden", "false");
            },

            popUpMenus: function () {
                // init pop menu content
                $('.pop-menu .pop-content').hide().attr("aria-hidden", "true");

                // init pop menu trigger
                $('.pop-menu .pop-trigger').addClass('trigger-inactive').attr("aria-haspopup", "true").attr("role", "button").attr("aria-expanded", "false").attr("aria-selected", "false");

                // open pop menu onclick
                $(document).on('click', '.pop-menu .trigger-inactive', function (event) {
                    window.headerAndFooter.closePopmenus();
                    window.headerAndFooter.openPopmenu(this);
                });

                // close menu on second click
                $(document).on('click', '.pop-menu .trigger-active', function (event) {
                    window.headerAndFooter.closePopmenus();
                });

                // close menus on click outside
                $(document).on('click', function (e) {
                    if ($(e.target).closest('.pop-menu').length === 0) {
                        window.headerAndFooter.closePopmenus();
                    }
                });

                // close menus on esc key
                $(document).on('keydown', function (e) {
                    if (e.keyCode === 27) {
                        window.headerAndFooter.closePopmenus();
                    }
                });

                // close menus on switching menus
                $('.pop-menu .trigger-inactive').focus(function () {
                    window.headerAndFooter.closePopmenus();
                });

                // open menu on down arrow
                $(document).on('keydown', '.pop-menu .trigger-inactive', function (e) {
                    if (e.keyCode === 40) {
                        e.preventDefault();
                        window.headerAndFooter.closePopmenus();
                        window.headerAndFooter.openPopmenu(this);
                    }
                });

                // close menu on up arrow
                $('.pop-menu .pop-trigger').on('keydown', function (e) {
                    if (e.keyCode === 38) {
                        e.preventDefault();
                        window.headerAndFooter.closePopmenus();
                    }
                });

                // open and close menu on spacebar
                $('.pop-menu .pop-trigger').on('keydown', function (e) {
                    if (e.keyCode === 32) {
                        e.preventDefault();
                        if ($(this).hasClass('trigger-inactive')) {
                            window.headerAndFooter.closePopmenus();
                            window.headerAndFooter.openPopmenu(this);
                        } else if ($(this).hasClass('trigger-active')) {
                            window.headerAndFooter.closePopmenus();
                        }

                    }
                });
            },

            popUpMenusToSection: function (sectionSelector) {
                // init pop menu content
                $('.pop-menu .pop-content', sectionSelector).hide().attr("aria-hidden", "true");

                // init pop menu trigger
                $('.pop-menu .pop-trigger', sectionSelector).removeClass('trigger-inactive').addClass('trigger-inactive').attr("aria-haspopup", "true").attr("role", "button").attr("aria-expanded", "false").attr("aria-selected", "false");

                // close menus on switching menus
                $('.pop-menu .trigger-inactive', sectionSelector).off("focus").on("focus", function () {
                    this.closePopmenus();
                });

                // close menus on keyboard focus outside
                $(sectionSelector + ' *').not('.pop-content *').off("focus").on("focus", function () {
                    this.closePopmenus();
                });

                // open menu on down arrow
                $('.pop-menu .trigger-inactive', sectionSelector).off('keydown').on('keydown', function (e) {
                    if (e.keyCode === 40) {
                        e.preventDefault();
                        this.closePopmenus();
                        openPopmenu(this);
                    }
                });

                $('.pop-menu .pop-trigger', sectionSelector).off('keydown').on('keydown', function (e) {
                    // close menu on up arrow
                    if (e.keyCode === 38) {
                        e.preventDefault();
                        this.closePopmenus();
                    }

                    // open and close menu on spacebar
                    if (e.keyCode === 32) {
                        e.preventDefault();
                        if ($(this).hasClass('trigger-inactive')) {
                            this.closePopmenus();
                            openPopmenu(this);
                        } else if ($(this).hasClass('trigger-active')) {
                            this.closePopmenus();
                        }

                    }
                });
            },

            initializeMenu: function () {

                if (this.lastWidth < this.mediaQuerieDesktop &&
                    this.actualWidth >= this.mediaQuerieDesktop &&
                    $(".header-search-box").hasClass("enabled")) {
                    this.hidePopupBackground();
                }

                this.resetHeader();

                if (window.innerWidth < this.mediaQuerieDesktop) {
                    if (!$('.header-search-box').hasClass("enabled")) {
                        $('.quick-search-carot').hide();
                    }
                }

                if (window.innerWidth >= this.mediaQuerieMobile && window.innerWidth < this.mediaQuerieDesktop) {
                    //mobile menu
                    this.setHeaderMediaQuery();
                }

                if (window.innerWidth < this.mediaQuerieMobile) {
                    this.setHeaderMediaQuery();

                    if ($('#dashboardContainer').length == 0) {
                        $('#header-profile-menu').children('li').first().after('<li id="dashboardContainer"></li>');
                        if (Configurations.isMigrationCompleted) {
                            $('#dashboardContainer').append($("[id*='lnkDashboard']"));
                            $("[id*='lnkDashboard']").removeClass();
                            $("[id*='lnkDashboard']").toggleClass('header-profile-menu');
                        }
                        else {
                            $('#dashboardContainer').append($("[id*='hlDashboard']"));
                            $("[id*='hlDashboard']").removeClass();
                            $("[id*='hlDashboard']").toggleClass('header-profile-menu');
                        }
                    }

                    if (!$('.header-item.profileMenu').hasClass("sprite")) {
                        $('.header-item.profileMenu').addClass("sprite");
                    }

                }
            },

            processSearch: function () {
                $('input[id$=HiddenFieldTxtQuery]').val(encodeURIComponent($('input[id$=txtQuery]').val().trim()));
                var searchTerm = $("input[id$=txtQuery]").val();
            },

            initializeFooter: function () {

                if (window.innerWidth < this.mediaQuerieDesktop) {

                    if (this.quickSearchboxMobileEnabled == true) {
                        $("footer").hide();
                    }
                    else {
                        $("footer").show();
                    }
                }
            },

            //Header functions
            setHeaderMediaQuery: function () {
                $('#header-courses').addClass("vertical");

                $('.header-item.search-mobile').addClass("enabled");
                $('.header-item.search-mobile').removeClass("disabled");
            },

            resetHeader: function () {
                $('#header-courses').removeClass("vertical");

                $('.header-item.search-mobile').removeClass("enabled");
                $('.header-item.search-mobile').addClass("disabled");

                if (this.actualWidth < this.mediaQuerieDesktop) {
                    if (this.lastWidth < 0 || this.lastWidth >= this.mediaQuerieDesktop) {
                        $('#search-bar').appendTo('.pop-menu.search').hide();
                    }
                } else {
                    $('#search-bar').insertAfter('.left-menu').css('display', 'inline-block');
                }

                if (this.actualWidth >= this.mediaQuerieDesktop) {
                    $('.header-search-box').removeClass("disabled");
                    $('.header-search-box').addClass("enabled");
                }

                if ($('#dashboardContainer').length > 0) {
                    if (Configurations.isMigrationCompleted) {
                        $('.header-item.profileMenu').before($("[id*='lnkDashboard']"))
                        $('#dashboardContainer').remove();
                        $("[id*='lnkDashboard']").removeClass();
                        $("[id*='lnkDashboard']").toggleClass('header-item dashboard');
                    }
                    else {
                        $('.header-item.profileMenu').before($("[id*='hlDashboard']"))
                        $('#dashboardContainer').remove();
                        $("[id*='hlDashboard']").removeClass();
                        $("[id*='hlDashboard']").toggleClass('header-item dashboard');
                    }
                }

                $('.header-item.profileMenu').removeClass("sprite");
            },

            showHeaderCourses: function () {
                if (!$('#header-courses').is(':visible')) {
                    this.closePopups(false, true);
                    $('.header-item.courses .carot').show();
                    $('#header-courses').show();
                    //$('.sprite.courseArrow').hide();
                    this.showPopupBackground();
                    $(".header-item.courses .text-style").css({ "font-weight": '600' });
                    $(".header-item.courses").css({ "background-color": '#005899' });
                } else {
                    this.closePopups(true, true);
                }
            },

            showHeaderProfileMenu: function () {

                if (!$('#header-profile-menu').is(':visible')) {
                   this.closePopups(false, true);
                    $('#header-profile-menu').show();
                    this.showPopupBackground();
                    $(".header-item.profileMenu .text-style").css({ "font-weight": '600' });
                    $(".header-item.profileMenu").css({ "background-color": '#005899' });
                } else {
                   this.closePopups(true, true);
                }
            },

            showQuickSearch: function () {
                if ($('.header-search-box').hasClass("enabled")) {
                   this.closePopups(true, true);
                    this.quickSearchboxMobileEnabled = false;
                }
                else {
                   this.closePopups(false, true);
                    $('.header-search-box').removeClass("disabled");
                    $('.header-search-box').addClass("enabled");
                    $('.quick-search-carot').show();
                    this.showPopupBackground();
                    this.quickSearchboxMobileEnabled = true;
                    $(".quicksearchbox").focus();
                }
            },

            showCountriesPopup: function () {

                if (!$('.footerPopUp').is(':visible')) {
                   this.closePopups(false, true);
                    $('.footer .comboCountries .carot').css('left', '');
                    $('.footer .comboCountries .carot').offset({ left: $('.footer .comboCountries .selected-country .text').position().left });
                    $('.footer .comboCountries .carot').show();
                    if (window.innerWidth < this.mediaQuerieMobile) {
                        $('#popups-footer-container').append($('.footerPopUp'));
                    } else {
                        $('#language-nav').append($('.footerPopUp'));
                    }

                    $('.footerPopUp').show();
                    this.showPopupBackground();
                } else {
                   this.closePopups(true, true);
                }

                this.resizePopUps();
            },

            closePopups: function (hideBackground, closeMigrationPopUp) {

                hideBackground = typeof hideBackground !== 'undefined' ? hideBackground : true;
                closeMigrationPopUp = typeof closeMigrationPopUp !== 'undefined' ? closeMigrationPopUp : true;

                $('#header-courses').hide();
                $('.header-item.courses .carot').hide();
                $('.footerPopUp').hide();
                $('.quick-search-carot').hide();
                $('.footer .comboCountries .carot').hide();
                $('#topicPage-container .arrange-popup').hide();
                $('.SavePopUp').hide();
                $('.popUpToShowCourseRemoveAlert').hide();


                if (this.actualWidth < this.mediaQuerieMobile) {
                    $("#topicPage-container .topic-version-nav .topic-versions").hide();
                }

                if (closeMigrationPopUp) {
                    $('.user-migrated').hide();
                    $('.user-migrated-loginTo').hide();
                }


                if (window.innerWidth < this.mediaQuerieDesktop && $('.header-search-box').hasClass("enabled")) {
                    $('.header-search-box').removeClass("enabled");
                    $('.header-search-box').addClass("disabled");
                }

                this.quickSearchboxMobileEnabled = false;

                this.closeLoginPopup(hideBackground);
                if (hideBackground) {
                    this.hidePopupBackground();
                }

                $(".header-item.courses .text-style").css({ "font-weight": '' });
                $(".header-item.courses").css({ "background-color": '' });
                $(".header-item.profileMenu .text-style").css({ "font-weight": '' });
                $(".header-item.profileMenu").css({ "background-color": '' });
            },

            showLoginPopup: function (popupClass) {
                if (IsUserMigrated) {
                    setTimeout(function () {
                        //Scroll to top and block scroll
                        $("html, body").animate({ scrollTop: 0 }, '300', 'swing', function () {
                            this.showMigrationPopUp("user-migrated-loginTo");
                        });
                    }, 0);

                    return;
                }


                // Tracking
                var promptName = "";
                switch (popupClass) {
                    case "popUpFirstTrialSignUp":
                        promptName = "7th Interaction";
                        break;
                    case "popUpLoginToSelfAssessment":
                        promptName = "Assessment";
                        break;
                    case "popUpLoginToAddLearningPlan":
                        promptName = "Learning Plan";
                        break;
                    case "popUpLogInToRate":
                        promptName = "Rate";
                        break;
                    case "popUpLoginToViewContent":
                        promptName = "Registered User login";
                        break;
                    default:
                        promptName = "";
                        break;
                }

                this.trackSignUpPrompt(promptName);

                var element = $('.' + popupClass).first();

                setTimeout(function () {
                    //Scroll to top and block scroll
                    $("html, body").animate({ scrollTop: 0 }, '300', 'swing', function () {
                        //Show overlay
                        this.showPopupBackground();

                        // Show popup
                        element.show();

                        element.attr("tabIndex", "-1");
                        element.focus();
                    });
                }, 0);
            },

            closeLoginPopup: function (hideBackground) {
                hideBackground = typeof hideBackground !== 'undefined' ? hideBackground : true;
                $('.popUpLogin').fadeOut();
                if (hideBackground) {
                    this.hidePopupBackground();
                }
            },

            showPopupBackground: function (hideOnClick) {
                var overlayTop = 0;

                if ($('.popupBackground').length == 0) {
                    var mask = jQuery("<div class='popupBackground' onclick='closePopups(true, true);'></div>");
                    mask.appendTo("body");
                }

                if (typeof hideOnClick != 'undefined') {
                    if (hideOnClick) {
                        $('.popupBackground').attr("onclick", "closePopups(true, true);")
                    } else {
                        $('.popupBackground').attr("onclick", "")
                    }
                } else {
                    $('.popupBackground').attr("onclick", "closePopups(true, true);")
                }

                $('.popupBackground').css("top", overlayTop + "px");
                /*$('.popupBackground').css("width", window.innerWidth + "px");*/

                var backgroundHeight = Math.max(document.body.scrollHeight, window.innerHeight);

                $('.popupBackground').css("height", backgroundHeight - overlayTop + "px");

                if (window.innerWidth > mediaQuerieMobile) {
                    $("body").css({ "overflow-y": "hidden" });
                }
                $('.popupBackground').fadeIn();
            },

            hidePopupBackground: function () {
                if ($('.popupBackground').is(':visible')) {
                    $("body").css({ "overflow-y": "auto" });
                    $('.popupBackground').fadeOut();
                }
            },

            showTabCourses: function (button) {
                if (!$('#tab-courses').is(":visible")) {
                    $('#tab-courses').show();
                    $('#tab-liveevents').hide();
                    $('#tab-books').hide();
                    $('#header-courses .btn').removeClass("active");
                    $(button).addClass('active');
                    $('.list-container.MPSBanner').hide();
                    if ($(button).children('.sprite.arrowActive').hasClass('disabled')) {
                        $(button).children('.sprite.arrowActive').removeClass('disabled');
                        $(button).children('.sprite.arrowActive').addClass('enabled');
                        $('#tab-liveevents-button').children('.sprite.arrowActive').removeClass('enabled');
                        $('#tab-liveevents-button').children('.sprite.arrowActive').addClass('disabled');
                        $('#tab-books-button').children('.sprite.arrowActive').removeClass('enabled');
                        $('#tab-books-button').children('.sprite.arrowActive').addClass('disabled');
                    }
                } else {
                    if (window.innerWidth < 1300) {
                        $('#tab-courses').hide();
                        $(button).removeClass('active');
                        $(button).children('.sprite.arrowActive').addClass('disabled');
                        $(button).children('.sprite.arrowActive').removeClass('enabled');
                    }
                }

                this.resizePopUps();
            },

            showTabLiveEvents: function (button) {
                if (!$('#tab-liveevents').is(":visible")) {
                    $('#tab-liveevents').show();
                    $('#tab-courses').hide();
                    $('#tab-books').hide();
                    $('#header-courses .btn').removeClass("active");
                    $(button).addClass('active');
                    $('.list-container.MPSBanner').hide();
                    if ($(button).children('.sprite.arrowActive').hasClass('disabled')) {
                        $(button).children('.sprite.arrowActive').removeClass('disabled');
                        $(button).children('.sprite.arrowActive').addClass('enabled');
                        $('#tab-courses-button').children('.sprite.arrowActive').removeClass('enabled');
                        $('#tab-courses-button').children('.sprite.arrowActive').addClass('disabled');
                        $('#tab-books-button').children('.sprite.arrowActive').removeClass('enabled');
                        $('#tab-books-button').children('.sprite.arrowActive').addClass('disabled');
                    }
                } else {
                    if (window.innerWidth < 1300) {
                        $('#tab-liveevents').hide();
                        $(button).removeClass('active');
                        $(button).children('.sprite.arrowActive').addClass('disabled');
                        $(button).children('.sprite.arrowActive').removeClass('enabled');
                    }
                }

                this.resizePopUps();
            },

            showTabBooks: function (button) {
                if (!$('#tab-books').is(":visible")) {
                    $('#tab-books').show();
                    $('#tab-courses').hide();
                    $('#tab-liveevents').hide();
                    $('#header-courses .btn').removeClass("active");
                    $(button).addClass('active');
                    if ($(button).children('.sprite.arrowActive').hasClass('disabled')) {
                        $('.list-container.MPSBanner').show();
                        $(button).children('.sprite.arrowActive').removeClass('disabled');
                        $(button).children('.sprite.arrowActive').addClass('enabled');
                        $('#tab-liveevents-button').children('.sprite.arrowActive').removeClass('enabled');
                        $('#tab-liveevents-button').children('.sprite.arrowActive').addClass('disabled');
                        $('#tab-courses-button').children('.sprite.arrowActive').removeClass('enabled');
                        $('#tab-courses-button').children('.sprite.arrowActive').addClass('disabled');

                    }
                } else {
                    if (window.innerWidth < 1300) {
                        $('#tab-books').hide();
                        $(button).removeClass('active');
                        $(button).children('.sprite.arrowActive').addClass('disabled');
                        $(button).children('.sprite.arrowActive').removeClass('enabled');
                        $('.list-container.MPSBanner').hide();
                    }
                }

                this.resizePopUps();
            },

            showTabCoursesList: function (button) {
                if ($('#header-courses').hasClass("vertical")) {
                    if ($(button).closest('.list-container').hasClass("open")) {
                        $('.list-container').removeClass("open");
                        $('.topics-title').removeClass("padBottom");
                    } else {
                        $('.list-container').removeClass("open");
                        $('.topics-title').removeClass("padBottom");
                        $(button).closest('.list-container').toggleClass("open").promise().done(function () { $(button).toggleClass("padBottom"); });
                    }

                    //$('.list-container').toggleClass("open");
                    //$(button).toggleClass("open")
                }

                this.resizePopUps();
            },

            /*******************/
            /**** SOCIAL BAR ***/
            /*******************/
            shareKipiDashbord: function (socialNetwork, title) {
                var message = "I'm taking this #KnowItProveIt #MSMVA challenge. You should too!";
                if (socialNetwork == "twitter") {
                    message = title + " - " + message;
                }
                this.goToSocialNetwork(socialNetwork, message, title, null, location.protocol + '//' + location.host + '/kipi.aspx');
            },

            shareKipiBadge: function (socialNetwork, title, PageUrl) {
                var message = "I just dominated this #KnowItProveIt #MSMVA challenge!";
                if (socialNetwork == "twitter") {
                    message = title + " - " + message;
                }
                this.goToSocialNetwork(socialNetwork, message, title, null, PageUrl);
            },

            goToSocialNetwork: function (socialNetwork, message, title, imageUrl, pageUrl) {

                var urlToOpen;
                var height, width;
                var urlToShare = (pageUrl) ? encodeURIComponent(pageUrl) : encodeURIComponent(document.URL);
                message = message ? message : "";
                title = title ? title : "";

                this.closeLoadingScreen();

                switch (socialNetwork) {
                    case 'facebook':
                        urlToOpen = 'http://www.facebook.com/dialog/feed?app_id=114189562003069'
                            + '&link=' + urlToShare
                            + '&description=' + encodeURIComponent(message)
                            + '&redirect_uri=' + encodeURIComponent('http://www.facebook.com');

                        if (title) {
                            urlToOpen += '&name=' + encodeURIComponent(title)
                        }
                        else {
                            urlToOpen += '&name=' + encodeURIComponent(document.title);
                        }

                        if (imageUrl) {
                            urlToOpen += '&picture=' + encodeURIComponent(imageUrl);
                        }

                        width = "1050";
                        height = "500";

                        break;

                    case 'twitter':
                        urlToOpen = 'https://twitter.com/intent/tweet?'
                            + 'text=' + encodeURIComponent(message)
                            + '&url=' + urlToShare;

                        width = "750";
                        height = "400";

                        break;

                    case 'linkedin':	// does not accept long url.
                        urlToShare = urlToShare.indexOf(encodeURIComponent('?')) === -1 ? urlToShare + encodeURIComponent("?share") : urlToShare;
                        urlToOpen = 'http://www.linkedin.com/shareArticle?mini=true'
                            + '&url=' + urlToShare
                            + '&title=' + encodeURIComponent(title)
                            + '&summary=' + encodeURIComponent(message)
                            + '&source=';

                        width = '1000';
                        height = '600';

                        break;

                    case 'email':
                        urlToOpen = 'mailto:?'
                            + 'subject=' + encodeURIComponent(title)
                            + '&body=' + encodeURIComponent(message + ' ')
                            + urlToShare;

                        width = '10';
                        height = '10';

                        break;
                }

                var socialWindow = window.open(urlToOpen, "", 'height=' + height + ',width=' + width);

                if (socialNetwork === 'email') {
                    setTimeout(function () {
                        socialWindow.close();
                    }, 2000);
                }
            },


            closeLoadingScreen: function () {
                $('div[id$="_uProgress"]').fadeOut("normal");
            },

            // Cookie notice

            setCookieNoticeMargin: function () {
                var isEmbeddedPlayer = (typeof (Configurations) != 'undefined' && typeof (Configurations.isEmbedPlayer) != 'undefined') ? Configurations.isEmbedPlayer : false;
                if (!isEmbeddedPlayer) {
                    $('#header').css('margin-top', $('.msl2CookieNotice').height() + 'px');
                    $('#content').css('margin-top', $('.msl2CookieNotice').height() + 'px');
                    $('.popUpLogin').css('margin-top', $('.msl2CookieNotice').height() + 'px');

                    $(window).resize(function () {
                        $('#header').css('margin-top', $('.msl2CookieNotice').height() + 'px');
                        $('#content').css('margin-top', $('.msl2CookieNotice').height() + 'px');
                        $('.popUpLogin').css('margin-top', $('.msl2CookieNotice').height() + 'px');
                    });
                }
            },

            closeCookieNotice: function () {
                $('#header').css('margin-top', '0px');
                $('#content').css('margin-top', '0px');
                $('.popUpLogin').css('margin-top', '0px');
                $('body.embed-player #course-info-container').css('top', ' 40px');

            },

            removeHTMLTags: function (text) {
                var rex = /(<([^>]+)>)/ig;
                return text.replace(rex, "");
            },

            saveShownMigrationBannerCookie: function () {
                $.cookie("ShownMigrationBanner", "", { path: '/' });
            },

            /*
                TRACKING
            */

            TrackingConstants: {
                courseNameTemplate: "Course {idMLX}: {courseName}"
            },

            executeMDOTrackingFunction: function (funcName, funcParams, retries) {
                try {
                    var fn = window[funcName];

                    if (typeof mdo !== "undefined") {
                        fn.apply(null, funcParams);
                    }
                    else {
                        if (retries === undefined) {
                            retries = 5;
                        }
                        if (retries > 0) {
                            setTimeout(function () { executeMDOTrackingFunction(funcName, funcParams, retries - 1) }, (6 - retries) * 1000);
                        }
                    }
                }
                catch (err) {
                    console.log('Error executing function: ' + funcName);
                }
            },

            executeTrackingFunction: function (funcName, funcParams, retries) {
                try {
                    var fn = window[funcName];

                    if (typeof fn === "function") {
                        fn.apply(null, funcParams);
                    } else {
                        if (retries === undefined) {
                            retries = 5;
                        }
                        if (retries > 0) {
                            setTimeout(function () { executeTrackingFunction(funcName, funcParams, retries - 1) }, (6 - retries) * 1000);
                        }
                    }
                    return true;
                }
                catch (err) {
                    console.log('Error executing function: ' + funcName);
                    return false;
                }
            },

            executeTrackPageLoad: function (pageLoadTrackingOptions) {
                if (typeof mdo !== "undefined") {
                    trackPageLoad(pageLoadTrackingOptions);
                }
                else {
                    setTimeout(function () {
                        executeTrackPageLoad(pageLoadTrackingOptions);
                    }, 250);
                }
            },

            trackPageLoad: function (pageLoadTrackingOptions) {
                if (pageLoadTrackingOptions.SiteSection == "home") {
                    //Tracking for home tile categories
                    try {
                        var tileCategory;

                        if (window.location.hash) {
                            // hash found
                            tileCategory = window.location.hash.substring(1); //removes the # character
                        } else {
                            tileCategory = getUserDataCookie().lastHomePageTileVisited;
                        }

                        var categoryToShow = $('li[name=' + tileCategory + ']');
                        if (categoryToShow.length == 0) {
                            tileCategory = defaultTile;
                        }

                        pageLoadTrackingOptions.PageName = "home|" + tileCategory;
                        PageLoadTrackingOptions.PageName = "home|" + tileCategory;
                    } catch (err) {
                        //Nothing to do if getUserDataCookie() is not defined.
                    }
                }

                if ((pageLoadTrackingOptions.SiteSection == "search" || pageLoadTrackingOptions.SiteSection == "courses")) {
                    //Tracking for recommendedSearchTerm
                    try {
                        var recommendedSearchTerm = getRecommSearchTermCookie();
                        pageLoadTrackingOptions.recommendedSearchTerm = recommendedSearchTerm;
                        if (recommendedSearchTerm != '') {
                            deleteRecommSearchTermCookie();
                        }
                    } catch (err) {
                    }
                }

                mdo.pushEvent('load', 'pageLoad', pageLoadTrackingOptions);
            },

            trackPersonasClick: function (element) {
                var roleName = element.closest('div').attr('id');
                var linkText = element.text();

                mdo.pushEvent("click", "link", {
                    linkDetails: "o",
                    linkName: "suggested starting points:" + roleName + ":" + linkText
                });
            },

            trackTopicPageAddToLearningPlan: function (planName, courseName, planSource, idMLX) {
                executeMDOTrackingFunction("trackTopicPageAddToLearningPlan_exec", arguments);
            },

            trackTopicPageAddToLearningPlan_exec: function (planName, courseName, planSource, idMLX) {
                mdo.pushEvent('click', 'Add to Learning Plan',
                {
                    'planName': planName,
                    'courseName': TrackingConstants.courseNameTemplate.replace("{idMLX}", idMLX).replace("{courseName}", courseName),
                    'planSource': planSource,
                    'playerType': (typeof (Configurations) != 'undefined' && typeof (Configurations.playerType) != 'undefined') ? Configurations.playerType : "",
                    'hostUrl': (typeof (Configurations) != 'undefined' && typeof (Configurations.coursePlayerHostUrl) != 'undefined') ? Configurations.coursePlayerHostUrl : ""
                });
            },

            trackCoursePlayerRating: function (ratingLevel, courseName, playerType, hostUrl, idMLX) {
                executeMDOTrackingFunction("trackCoursePlayerRating_exec", arguments);
            },

            trackCoursePlayerRating_exec: function (ratingLevel, courseName, playerType, hostUrl, idMLX) {
                mdo.pushEvent("send", 'rating', {
                    'ratingLevel': ratingLevel,
                    'courseName': TrackingConstants.courseNameTemplate.replace("{idMLX}", idMLX).replace("{courseName}", courseName),
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackTopicRelatedTab: function (relatedTab) {
                executeMDOTrackingFunction("trackTopicRelatedTab_exec", arguments);
            },

            trackTopicRelatedTab_exec: function (relatedTab) {
                mdo.pushEvent('click', 'relatedTab',
                {
                    'relatedTab': relatedTab
                });
            },

            trackTopicRelatedResources: function (relatedTab, resourceName) {
                executeMDOTrackingFunction("trackTopicRelatedResources_exec", arguments);
            },

            trackTopicRelatedResources_exec: function (relatedTab, resourceName) {
                mdo.pushEvent('click', 'relatedResources',
                {
                    'relatedTab': relatedTab,
                    'resourceName': resourceName
                });
            },

            trackRssFeed: function (rssFeedName) {
                executeMDOTrackingFunction("trackRssFeed_exec", arguments);
            },

            trackRssFeed_exec: function (rssFeedName) {
                mdo.pushEvent('click', 'rssFeed',
                {
                    'rssFeedName': rssFeedName
                });
            },

            trackSearchResultsAddToLearningPlan: function (lpName, courseName, idMLX) {
                executeMDOTrackingFunction("trackSearchResultsAddToLearningPlan_exec", arguments);
            },

            trackSearchResultsAddToLearningPlan_exec: function (lpName, courseName, idMLX) {
                mdo.pushEvent('click', 'Add to Learning Plan', {
                    'planName': "'" + lpName + "'",
                    'courseName': TrackingConstants.courseNameTemplate.replace("{idMLX}", idMLX).replace("{courseName}", courseName)
                });
            },

            trackSearchResultsCourseLink: function (courseName, courseLevel, idMLX, searchRank) {
                executeMDOTrackingFunction("trackSearchResultsCourseLink_exec", arguments);
            },

            trackSearchResultsCourseLink_exec: function (courseName, courseLevel, idMLX, searchRank) {
                mdo.pushEvent('click', 'courseLink', {
                    'courseName': TrackingConstants.courseNameTemplate.replace("{idMLX}", idMLX).replace("{courseName}", courseName),
                    'courseLevel': "'Level  " + courseLevel + "'",
                    'searchRank': searchRank
                });
            },

            trackSearchResultsArrangeBy: function (arrangeByCriteria) {
                executeMDOTrackingFunction("trackSearchResultsArrangeBy_exec", arguments);
            },

            trackSearchResultsArrangeBy_exec: function (arrangeByCriteria) {
                mdo.pushEvent('click', 'arrangeBy',
                    {
                        'arrangeByCriteria': "'" + arrangeByCriteria + "'"
                    });
            },

            trackSearchResults: function (searchTerm, numSearchResults) {
                executeMDOTrackingFunction("trackSearchResults_exec", arguments);
            },

            trackSearchResults_exec: function (searchTerm, numSearchResults) {
                setTimeout(function () {
                    mdo.pushEvent('searchAction', 'search',
                    {
                        'searchTerm': "'" + searchTerm + "'",
                        'numSearchResults': numSearchResults
                    });
                }, 3000);
            },

            trackHeaderNavigation: function (link) {
                executeMDOTrackingFunction("trackHeaderNavigation_exec", arguments);
            },

            trackHeaderNavigation_exec: function (link) {
                mdo.pushEvent('click', 'link',
                {
                    'linkName': link
                });
            },

            trackSocialShareClick: function (socialName) {
                executeMDOTrackingFunction("trackSocialShareClick_exec", arguments);
            },

            trackSocialShareClick_exec: function (socialName) {
                mdo.pushEvent('click', 'share',
                {
                    'socialName': socialName
                });
            },

            trackKipiChallengeClick: function (challengeName) {
                executeMDOTrackingFunction("trackKipiChallengeClick_exec", arguments);
            },

            trackKipiChallengeClick_exec: function (challengeName) {
                mdo.pushEvent('challengeClick', 'kipi',
                {
                    'challengeName': challengeName
                });
            },

            trackKipiChallengeSignUp: function (challengeName) {
                executeMDOTrackingFunction("trackKipiChallengeSignUp_exec", arguments);
            },

            trackKipiChallengeSignUp_exec: function (challengeName) {
                mdo.pushEvent('challengeSignUp', 'kipi',
                {
                    'challengeName': challengeName
                });
            },

            trackBadgeDetailsClick: function (badgeType, name) {

                mdo.pushEvent('viewBadge', 'badge', {
                    'badgeCategory': badgeType,
                    'badgeName': name
                });

                return true;
            },

            trackLearningTrackAccordionClick: function (challengeName, courseTitle, courseLink, openInWindow) {
                mdo.pushEvent('viewCourse', 'learningPath', {
                    'learningPathName': challengeName,
                    'courseName': courseTitle
                });

                if (openInWindow) {
                    var win = window.open(courseLink, '_blank');
                    win.focus();
                }
                else {
                    var win = window.open(courseLink, '_self');
                    win.focus();
                }

            },

            trackKipiAccordionLinkClick: function (challengeName, courseTitle, courseLink) {
                executeMDOTrackingFunction("trackKipiAccordionLinkClick_exec", arguments);
            },

            trackKipiAccordionLinkClick_exec: function (challengeName, courseTitle, courseLink, isDashboard) {
                mdo.pushEvent('linkClick', 'kipi', {
                    'challengeName': challengeName,
                    'accordionName': courseTitle,
                    'linkName': courseLink
                });

                if (isDashboard) {
                    window.location.href = courseLink;
                }
                else {
                    var win = window.open(courseLink, '_blank');
                    win.focus();
                }
            },

            trackKipiSocialShareClick: function (socialName, challengeName, challengeStatus) {
                executeMDOTrackingFunction("trackKipiSocialShareClick_exec", arguments);
            },

            trackKipiSocialShareClick_exec: function (socialName, challengeName, challengeStatus) {
                if (challengeName) {
                    mdo.pushEvent('socialShare', 'kipi',
                    {
                        'challengeName': challengeName,
                        'challengeStatus': challengeStatus,
                        'socialName': socialName
                    });
                }
                else {
                    mdo.pushEvent('socialShare', 'kipi',
                    {
                        'socialName': socialName
                    });
                }
            },

            trackKipiChallengeAccepted: function (challengeName) {
                executeMDOTrackingFunction("trackKipiChallengeAccepted_exec", arguments);
            },

            trackKipiChallengeAccepted_exec: function (challengeName) {
                mdo.pushEvent('challengeAccept', 'kipi', {
                    'challengeName': challengeName
                });
            },

            trackCoursePlayerSocialShare: function (socialName, contentID, contentName, contentType, moduleName, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCoursePlayerSocialShare_exec", arguments);
            },

            trackCoursePlayerSocialShare_exec: function (socialName, contentID, contentName, contentType, moduleName, playerType, hostUrl) {
                mdo.pushEvent("share", "socialShare", {
                    "socialName": socialName,
                    "contentID": contentID,
                    "contentName": contentName,
                    "contentType": contentType,
                    "moduleName": moduleName,
                    "playerType": playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackAssessmentEvent: function (action, contentID, contentName, contentType, moduleName, playerType, hostUrl) {
                executeMDOTrackingFunction("trackAssessmentEvent_exec", arguments);
            },

            trackAssessmentEvent_exec: function (action, contentID, contentName, contentType, moduleName, playerType, hostUrl) {
                mdo.pushEvent(action, 'assessment', {
                    'contentID': contentID,
                    'contentName': contentName,
                    'contentType': contentType,
                    'moduleName': moduleName,
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackCoursePlayerInfoTabClick: function (tabName, tabUrl, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCoursePlayerInfoTabClick_exec", arguments);
            },

            trackCoursePlayerInfoTabClick_exec: function (tabName, tabUrl, playerType, hostUrl) {
                mdo.pushEvent('click', 'courseInfoTab', {
                    'tabName': tabName,
                    'tabUrl': tabUrl,
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackBeforeSignInClick: function (buttonName) {
                executeMDOTrackingFunction("trackSignUpPrompt_exec", arguments);
            },

            trackBeforeSignInClick_exec: function (buttonName) {
                mdo.pushEvent('click', 'button',
                    {
                        'buttonName': buttonName
                    });
            },

            trackSignUpPrompt: function (promptName) {
                executeMDOTrackingFunction("trackSignUpPrompt_exec", arguments);
            },

            trackSignUpPrompt_exec: function (promptName) {
                mdo.pushEvent("pop", "prompt",
                    {
                        "promptType": "Sign Up Prompt",
                        "promptName": promptName
                    });
            },

            trackNavigationClick: function (navigationElement, linkType) {
                executeMDOTrackingFunction("trackNavigationClick_exec", arguments);
            },

            trackNavigationClick_exec: function (navigationElement, linkType) {
                mdo.pushEvent('click', 'link',
                {
                    'linkName': navigationElement,
                    'linkDetails': linkType
                });
            },

            trackFooterComboLanguagesClick: function (originalLanguage, newLanguage) {
                executeMDOTrackingFunction("trackFooterComboLanguagesClick_exec", arguments);
            },

            trackFooterComboLanguagesClick_exec: function (originalLanguage, newLanguage) {
                mdo.pushEvent("click", "link", {
                    linkName: "footer:language:" + newLanguage,
                    additionalEvents: {
                        changeProfile: true
                    },
                    profileSetting: "language:" + originalLanguage + ";" + newLanguage
                });

            },

            trackFooterFollowUs: function (socialMediaName) {
                executeMDOTrackingFunction("trackFooterFollowUs_exec", arguments);
            },

            trackFooterFollowUs_exec: function (socialMediaName) {
                mdo.pushEvent("click", "link", {
                    linkName: "footer:follow us:" + socialMediaName
                });

            },

            trackHeaderEbookClick: function (bookName) {
                executeMDOTrackingFunction("trackHeaderEbookClick_exec", arguments);
            },

            trackHeaderEbookClick_exec: function (bookName) {
                mdo.pushEvent('click', 'link', {
                    'linkName': bookName,
                    'linkType': 'Books',
                    'location': 'header'
                });
            },

            trackHomePageImagineLearnMore: function () {
                executeMDOTrackingFunction("trackHomePageImagineLearnMore_exec", arguments);
            },

            trackHomePageImagineLearnMore_exec: function () {
                mdo.pushEvent('click', 'link', {
                    'linkName': "Learn More",
                    'linkType': 'Imagine',
                    'location': 'home:students'
                });
            },

            trackRegistrationOpen: function () {
                executeMDOTrackingFunction("trackRegistrationOpen_exec", arguments);
            },

            trackRegistrationOpen_exec: function () {
                setTimeout(function () {
                    mdo.pushEvent('registrationDetails', 'signUpPrompt', { 'promptName': 'Register', 'pageName': 'Register' });
                }, 3000);
            },

            trackRegistrationDone: function (jobFunctionID, userCountryName, userLanguageID, acceptCommunicationID, prePopulatedUserCountry, prePopulatedUserLanguage, prePopulatedAcceptCommunication) {
                executeMDOTrackingFunction("trackRegistrationDone_exec", arguments);
            },

            trackRegistrationDone_exec: function (jobFunctionID, userCountryName, userLanguageID, acceptCommunicationID, prePopulatedUserCountry, prePopulatedUserLanguage, prePopulatedAcceptCommunication, txtCompanyID) {

                var jobFunction = $('#' + jobFunctionID + ' option:selected').text().toLowerCase();
                var userCountry = userCountryName.toLowerCase();
                var userLanguage = $('#' + userLanguageID + ' option:selected').text().toLowerCase();
                var acceptCommunication = $('#' + acceptCommunicationID).is(":checked") ? "yes" : "no";
                var companyName = $('#' + txtCompanyID).val();

                if (userCountry == prePopulatedUserCountry && userLanguage == prePopulatedUserLanguage && acceptCommunication == prePopulatedAcceptCommunication) {
                    mdo.pushEvent("activationComplete", "signUpPrompt", {
                        promptName: "Register",
                        jobFunction: jobFunction,
                        organization: companyName,
                        country: userCountry,
                        language: userLanguage,
                        communicationPreference: acceptCommunication,
                    });
                } else {
                    //The additionalEvents and profileSetting variables should be included in the pushEvent function only if the visitor modifies any setting related to country, language or communication preference. 
                    var profileSettings = [];

                    if (userCountry != prePopulatedUserCountry)
                        profileSettings.push("country:" + prePopulatedUserCountry + "," + userCountry);
                    if (userLanguage != prePopulatedUserLanguage)
                        profileSettings.push("language:" + prePopulatedUserLanguage + "," + userLanguage);
                    if (acceptCommunication != prePopulatedAcceptCommunication)
                        profileSettings.push("communicationPreference:" + prePopulatedAcceptCommunication + "," + acceptCommunication);

                    mdo.pushEvent("activationComplete", "signUpPrompt", {
                        promptName: "Register",
                        jobFunction: jobFunction,
                        country: userCountry,
                        language: userLanguage,
                        communicationPreference: acceptCommunication,
                        additionalEvents: {
                            changeProfile: true
                        },
                        profileSetting: profileSettings.join("|")
                    });
                }
            },

            trackMyProfileSave: function (previousLanguageName, newLanguageNameElementID, previousCommunicationPreference, newCommunicationPreferenceElementID, previousPartnerCommunicationPreference, newPartnerCommunicationPreferenceElementID, previousJobFunction, newJobFunctionElementID, previousOrganization, newOrganizationElementID) {
                executeMDOTrackingFunction("trackMyProfileSave_exec", arguments);
            },

            trackMyProfileSave_exec: function (previousLanguageName, newLanguageNameElementID, previousCommunicationPreference, newCommunicationPreferenceElementID, previousPartnerCommunicationPreference, newPartnerCommunicationPreferenceElementID, previousJobFunction, newJobFunctionElementID, previousOrganization, newOrganizationElementID) {

                var newLanguageName = $('#' + newLanguageNameElementID + ' option:selected').text().toLowerCase();
                var newCommunicationPreference = $('#' + newCommunicationPreferenceElementID).is(":checked") ? "yes" : "no";
                var newPartnerCommunicationPreference = $('#' + newPartnerCommunicationPreferenceElementID).is(":checked") ? "yes" : "no";
                var newJobFunction = $('#' + newJobFunctionElementID + ' option:selected').text().toLowerCase();
                var newOrganization = $('#' + newOrganizationElementID).val().toLowerCase();

                var profileSettings = [];

                if (previousLanguageName != newLanguageName)
                    profileSettings.push("language:" + previousLanguageName + "," + newLanguageName);
                if (previousCommunicationPreference != newCommunicationPreference)
                    profileSettings.push("microsoft communication:" + previousCommunicationPreference + "," + newCommunicationPreference);
                if (previousPartnerCommunicationPreference != newPartnerCommunicationPreference)
                    profileSettings.push("microsoft partner communication:" + previousPartnerCommunicationPreference + "," + newPartnerCommunicationPreference);
                if (previousJobFunction != newJobFunction)
                    profileSettings.push("job function:" + previousJobFunction + "," + newJobFunction);
                if (previousOrganization != newOrganization)
                    profileSettings.push("organization:" + previousOrganization + "," + newOrganization);

                if (profileSettings.length == 0) {
                    mdo.pushEvent("save", "profile", {});
                } else {
                    mdo.pushEvent("save", "profile", {
                        additionalEvents: {
                            changeProfile: true
                        },
                        profileSetting: profileSettings.join("|")
                    });
                }
            },

            trackMigratedMyProfileSave: function (previousLanguageName, newLanguageNameElementID, previousCommunicationPreference, newCommunicationPreferenceElementID, previousPartnerCommunicationPreference, newPartnerCommunicationPreferenceElementID, previousJobFunction, newJobFunctionElementID, previousOrganization, newOrganizationElementID) {
                executeMDOTrackingFunction("trackMigratedMyProfileSave_exec", arguments);
            },

            trackMigratedMyProfileSave_exec: function (previousLanguageName, newLanguageNameElementID, previousCommunicationPreference, newCommunicationPreferenceElementID, previousPartnerCommunicationPreference, newPartnerCommunicationPreferenceElementID, previousJobFunction, newJobFunctionElementID, previousOrganization, newOrganizationElementID) {

                var newLanguageName = $('#' + newLanguageNameElementID + ' option:selected').text().toLowerCase();
                var newCommunicationPreference = $("[id$='chkHearFromMicrosoft']:checked").length == 1 ? "yes" : "no";
                var newPartnerCommunicationPreference = $("[id$='chkHearFromMicrosoftPartners']:checked").length == 1 ? "yes" : "no";
                var newJobFunction = $('#' + newJobFunctionElementID + ' option:selected').text().toLowerCase();
                var newOrganization = $('#' + newOrganizationElementID).val().toLowerCase();

                var profileSettings = [];

                if (previousLanguageName != newLanguageName)
                    profileSettings.push("language:" + previousLanguageName + "," + newLanguageName);
                if (previousCommunicationPreference != newCommunicationPreference)
                    profileSettings.push("microsoft communication:" + previousCommunicationPreference + "," + newCommunicationPreference);
                if (previousPartnerCommunicationPreference != newPartnerCommunicationPreference)
                    profileSettings.push("microsoft partner communication:" + previousPartnerCommunicationPreference + "," + newPartnerCommunicationPreference);
                if (previousJobFunction != newJobFunction)
                    profileSettings.push("job function:" + previousJobFunction + "," + newJobFunction);
                if (previousOrganization != newOrganization)
                    profileSettings.push("organization:" + previousOrganization + "," + newOrganization);

                if (profileSettings.length == 0) {
                    mdo.pushEvent("save", "profile", {});
                } else {
                    mdo.pushEvent("save", "profile", {
                        additionalEvents: {
                            changeProfile: true
                        },
                        profileSetting: profileSettings.join("|")
                    });
                }
            },

            trackMyProfileCancel: function () {
                executeMDOTrackingFunction("trackMyProfileCancel_exec", arguments);
            },

            trackMyProfileCancel_exec: function () {
                mdo.pushEvent("cancel", "profile", {});
            },

            trackContentLinks: function (contentElement, linkType) {
                mdo.pushEvent('click', 'link',
                {
                    'linkName': contentElement,
                    'linkDetails': linkType
                });

                return true;
            },

            trackContentLinks_exec: function (contentElement, linkType) {
                mdo.pushEvent('click', 'link',
                {
                    'linkName': contentElement,
                    'linkDetails': linkType
                });
            },

            trackFileDownloadClick: function (downloadTitle, downloadType, elementName) {
                trackPlayerContentClick(downloadType, downloadTitle);
            },

            trackVideoClick: function (videoName) {
                trackPlayerContentClick('video', videoName);
            },

            trackPlayerContentClick: function (typeOfContent, contentName) {
                executeMDOTrackingFunction("trackPlayerContentClick_exec", arguments);
            },

            trackPlayerContentClick_exec: function (typeOfContent, contentName) {
                mdo.pushEvent('click', 'courseContent', {
                    'type of content': typeOfContent, //manual or presentation or assessment or video
                    'contentName': contentName //Name of the content being clicked on
                });
            },

            trackCoursePlayerSignInClick: function (buttonName) {
                executeMDOTrackingFunction("trackSignInPrompt_exec", arguments);
            },

            trackSignInPrompt_exec: function (linkName) {
                if (linkName != "") {
                    mdo.pushEvent("click", "prompt",
                    {
                        "linkName": linkName,
                        "promptName": "5 Mins Video Consumption",
                        "promptType": "Sign In Prompt"
                    });
                } else {
                    mdo.pushEvent("pop", "prompt",
                    {
                        "promptName": "5 Mins Video Consumption",
                        "promptType": "Sign In Prompt"
                    });
                }
            },

            trackCertificateDownloadClick: function (trackName) {
                executeMDOTrackingFunction("trackCertificateDownloadClick_exec", arguments);
            },

            trackCertificateDownloadClick_exec: function (trackName) {
                mdo.pushEvent('download', trackName,
                {
                    'downloadDetails': 'Certificate Download'
                });
            },

            trackTranscriptDownloadClick: function (trackName) {
                executeMDOTrackingFunction("trackTranscriptDownloadClick_exec", arguments);
            },

            trackTranscriptDownloadClick_exec: function (trackName) {
                mdo.pushEvent('download', trackName,
                {
                    'downloadDetails': 'Transcript Download'
                });
            },

            trackVideoPlaybackEvent: function (action, videoId, videoName, videoOffset, videoLength, milestone, moduleName, language, audience, audienceDetail, audienceTheme, contentType, playerType, hostUrl) {
                executeMDOTrackingFunction("trackVideoPlaybackEvent_exec", arguments);
            },

            trackVideoPlaybackEvent_exec: function (action, videoId, videoName, videoOffset, videoLength, milestone, moduleName, language, audience, audienceDetail, audienceTheme, contentType, playerType, hostUrl) {
                mdo.pushEvent(action, 'video',
                {
                    'videoID': typeof (videoId) !== "undefined" ? videoId : "0",
                    'videoName': typeof (videoName) !== "undefined" ? videoName : "",
                    'videoOffset': typeof (videoOffset) !== "undefined" ? videoOffset.toString() : "0",
                    'videoLength': typeof (videoLength) !== "undefined" ? videoLength.toString() : "0",
                    'milestone': typeof (milestone) !== "undefined" ? milestone.toString() : "0",
                    'moduleName': typeof (moduleName) !== "undefined" ? moduleName : "",
                    'language': typeof (language) !== "undefined" ? language : "",
                    'audience': typeof (audience) !== "undefined" ? audience.toLowerCase().replace("-", " ") : "",
                    'audienceDetail': typeof (audienceDetail) !== "undefined" ? audienceDetail.toLowerCase().replace("-", " ") : "",
                    'audienceTheme': typeof (audienceTheme) !== "undefined" ? audienceTheme.toLowerCase().replace("-", " ") : "",
                    'contentType': typeof (contentType) !== "undefined" ? contentType.toLowerCase().replace("-", " ") : "",
                    'distributor': "",
                    'author': "",
                    'source': "",
                    'file': "",
                    'category': "",
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackCourseRetirementButton: function (buttonName, courseName, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCourseRetirementButton_exec", arguments);
            },

            trackCourseRetirementButton_exec: function (buttonName, courseName, playerType, hostUrl) {
                mdo.pushEvent('click', 'button',
                {
                    'buttonName': buttonName,
                    'courseName': typeof courseName != "undefined" ? courseName : "",
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackCourseRetirementLink: function (courseName, courseLevel) {
                executeMDOTrackingFunction("trackCourseRetirementLink_exec", arguments);
            },

            trackCourseRetirementLink_exec: function (courseName, courseLevel) {
                mdo.pushEvent('click', 'courseLink', { 'courseName': courseName, 'courseLevel': 'Level ' + courseLevel });
            },

            trackCourseRetirementAlert: function (alertName, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCourseRetirementAlert_exec", arguments);
            },

            trackCourseRetirementAlert_exec: function (alertName, playerType, hostUrl) {
                mdo.pushEvent('appear', 'alert',
                {
                    'alertName': alertName,
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackVideoPlaybackAccumulatedTime: function (info, playerType, hostUrl) {
                executeMDOTrackingFunction("trackVideoPlaybackAccumulatedTime_exec", arguments);
            },

            trackVideoPlaybackAccumulatedTime_exec: function (info, playerType, hostUrl) {
                mdo.pushEvent('heartbeat', 'video', {
                    'videoID': info.lesson.id,
                    'videoName': info.lesson.title,
                    'videoOffset': info.lesson.videoOffset,
                    'videoLength': info.lesson.videoLength,
                    'moduleName': info.lesson.moduleName,
                    'milestone': (info.currentPosition * 100) / info.lesson.videoLength,
                    'timer': info.seconds,
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackPlayerCourseContentClick: function (contentId, contentName, contentLink, contentType, moduleName, clickOn, playerType, hostUrl) {
                executeMDOTrackingFunction("trackPlayerCourseContentClick_exec", arguments);
            },

            trackPlayerCourseContentClick_exec: function (contentId, contentName, contentLink, contentType, moduleName, clickOn, playerType, hostUrl) {
                mdo.pushEvent('click', 'courseContent', {
                    'contentID': contentId,
                    'contentName': contentName,
                    'contentLink': contentLink,
                    'contentType': contentType,
                    'moduleName': moduleName,
                    'clickOn': clickOn,
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackCoursePlayerEngagement: function (engagementLevel, moduleName, courseName, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCoursePlayerEngagement_exec", arguments);
            },

            trackCoursePlayerEngagement_exec: function (engagementLevel, moduleName, courseName, playerType, hostUrl) {
                mdo.pushEvent("engage", 'engagement', {
                    'engagementLevel': engagementLevel,
                    'moduleName': moduleName,
                    'courseName': courseName, //Already in format "Course {idMLX}: {courseName}"
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackCoursePlayerAddToLearningPlan: function (planName, courseName, planSource, idMLX) {
                executeMDOTrackingFunction("trackCoursePlayerAddToLearningPlan_exec", arguments);
            },

            trackCoursePlayerAddToLearningPlan_exec: function (planName, courseName, planSource, idMLX) {
                mdo.pushEvent("apply", 'add to learning plan', {
                    'courseName': TrackingConstants.courseNameTemplate.replace("{idMLX}", idMLX).replace("{courseName}", courseName),
                    'planName': planName,
                    'planSource': planSource,
                    'playerType': Configurations.playerType,
                    'hostUrl': typeof (Configurations.coursePlayerHostUrl) !== "undefined" ? Configurations.coursePlayerHostUrl : ""
                });
            },

            trackSearchFiltersAdd: function (itemSelected, filterTitle, filterProduct, filterProductVersion, filterTopic, filterLevel, filterJobFunction, filterLanguage) {
                executeMDOTrackingFunction("trackSearchFiltersAdd_exec", arguments);
            },

            trackSearchFiltersAdd_exec: function (itemSelected, filterTitle, filterProduct, filterProductVersion, filterTopic, filterLevel, filterJobFunction, filterLanguage) {
                mdo.pushEvent("click", "narrowby", {
                    narrowName: "add:" + itemSelected,
                    narrowType: filterTitle,
                    combinedFilters: "product:" + (filterProduct ? filterProduct : "none") + "|product version:" + (filterProductVersion ? filterProductVersion : "none") + "|topic:" + (filterTopic ? filterTopic : "none") + "|level:" + (filterLevel ? filterLevel : "none") + "|job function:" + (filterJobFunction ? filterJobFunction : "none") + "|language:" + (filterLanguage ? filterLanguage : "none")
                });
            },

            trackSearchFiltersRemove: function (itemSelected, filterTitle, filterProduct, filterProductVersion, filterTopic, filterLevel, filterJobFunction, filterLanguage) {
                executeMDOTrackingFunction("trackSearchFiltersRemove_exec", arguments);
            },

            trackSearchFiltersRemove_exec: function (itemSelected, filterTitle, filterProduct, filterProductVersion, filterTopic, filterLevel, filterJobFunction, filterLanguage) {
                mdo.pushEvent("click", "narrowby", {
                    narrowName: "remove:" + itemSelected,
                    narrowType: filterTitle,
                    combinedFilters: "product:" + (filterProduct ? filterProduct : "none") + "|product version:" + (filterProductVersion ? filterProductVersion : "none") + "|topic:" + (filterTopic ? filterTopic : "none") + "|level:" + (filterLevel ? filterLevel : "none") + "|job function:" + (filterJobFunction ? filterJobFunction : "none") + "|language:" + (filterLanguage ? filterLanguage : "none")
                });
            },

            trackSearchFiltersReset: function () {
                executeMDOTrackingFunction("trackSearchFiltersReset_exec", arguments);
            },

            trackSearchFiltersReset_exec: function () {
                mdo.pushEvent("click", "narrowby", {
                    narrowName: "",
                    narrowType: "reset filters"
                });
            },

            trackSysMessage: function (msjType, msjCode, msjText) {
                executeMDOTrackingFunction("trackSysMessage_exec", arguments);
            },

            trackSysMessage_exec: function (msjType, msjCode, msjText) {
                mdo.pushEvent("pop", "sysMessage", {
                    sysMessageType: [msjType],
                    sysMessageCode: [msjCode],
                    sysMessageText: [msjText]
                });
            },

            trackCourseContent: function (tab, link, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCourseContent_exec", arguments);
            },

            trackCourseContent_exec: function (tab, link, playerType, hostUrl) {
                mdo.pushEvent("linkClick", 'courseContent', {
                    'linkLocation': tab.attr('aria-controls'),
                    'linkName': link.text(),
                    'linkUrl': link.attr('href'),
                    'playerType': playerType,
                    'hostUrl': typeof (hostUrl) !== "undefined" ? hostUrl : ""
                });
            },

            trackCourseResourceDownload: function (downloadAll, linkUrls, resourceNames, playerType, hostUrl) {
                executeMDOTrackingFunction("trackCourseResourceDownload_exec", arguments);
            },

            trackCourseResourceDownload_exec: function (downloadAll, linkUrls, resourceNames, playerType, hostUrl) {
                mdo.pushEvent('resourceDownload', 'courseContent', {
                    linkLocation: 'resource',
                    linkName: downloadAll ? "download all" : "download",
                    linkUrl: linkUrls,
                    resourceName: resourceNames,
                    playerType: playerType,
                    hostUrl: hostUrl
                });
            },

            trackEmbeddedCourseUnsupportedMessage: function (action, message, contentId, contentName, contentType, contentLink, moduleName, playerType, hostUrl) {
                executeMDOTrackingFunction("trackEmbeddedCourseUnsupportedMessage_exec", arguments);
            },

            trackEmbeddedCourseUnsupportedMessage_exec: function (action, message, contentId, contentName, contentType, contentLink, moduleName, playerType, hostUrl) {
                mdo.pushEvent(action, 'unsupportedMessage', {
                    messageType: 'content not available',
                    messageId: '',
                    messageDetails: message,
                    contentID: contentId,
                    contentName: contentName,
                    contentType: contentType,
                    contentLink: contentLink,
                    moduleName: moduleName,
                    playerType: playerType,
                    hostUrl: hostUrl
                });
            },

            trackEmbedPlayerStartCourse: function (moduleName, contentName, courseName, playerType, hostUrl, idMLX) {
                executeMDOTrackingFunction("trackEmbedPlayerStartCourse_exec", arguments);
            },

            trackEmbedPlayerStartCourse_exec: function (moduleName, contentName, courseName, playerType, hostUrl, idMLX) {
                mdo.pushEvent('engage', 'engagement', {
                    engagementLevel: 'course start',
                    moduleName: moduleName,
                    contentName: contentName,
                    courseName: TrackingConstants.courseNameTemplate.replace("{idMLX}", idMLX).replace("{courseName}", courseName),
                    playerType: playerType,
                    hostUrl: hostUrl
                });
            },

            trackHomeBannerClick: function (bannerName, linkType, position) {
                return executeTrackingFunction("trackHomeBannerClick_impl", arguments);
            },

            trackLiveEventBannerClick: function (liveEventName, linkType, position) {
                return executeTrackingFunction("trackLiveEventBannerClick_impl", arguments);
            },

            trackRecommendedTrackClick: function (trackName) {
                return executeTrackingFunction("trackRecommendedTrackClick_impl", arguments);
            },

            trackFullEngagement: function (moduleName) {
                return executeTrackingFunction("trackFullEngagement_impl", arguments);
            },

            trackAssessmentStarted: function (moduleName) {
                return executeTrackingFunction("trackAssessmentStarted_impl", arguments);
            },

            trackAssessmentCompleted: function (moduleName) {
                return executeTrackingFunction("trackAssessmentCompleted_impl", arguments);
            },

            trackRedeemVoucher: function (voucherCode) {
                return executeTrackingFunction("trackRedeemVoucher_impl", arguments);
            },

            trackEventRegistration: function (eventName, code) {
                return executeTrackingFunction("trackEventRegistration_impl", arguments);
            },

            trackEventSignupToRegistration: function (eventName) {
                return executeTrackingFunction("trackEventSignupToRegistration_impl", arguments);
            },

            trackLiveEventRegistration: function (eventName, code) {
                return executeTrackingFunction("trackLiveEventRegistration_impl", arguments);
            },

            trackLiveEventFeedback: function (eventName) {
                return executeTrackingFunction("trackLiveEventFeedback_impl", arguments);
            },

            trackSocialEvents: function (eventName) {
                return executeTrackingFunction("trackSocialEvents_impl", arguments);
            },

            trackCourseCompletion: function (courseName) {
                return executeTrackingFunction("trackCourseCompletion_impl", arguments);
            },

            trackCourseRating: function (courseName, value) {
                return executeTrackingFunction("trackCourseRating_impl", arguments);
            },

            trackDashboardAlertClosing: function (alertName) {
                return executeTrackingFunction("trackDashboardAlertClosing_impl", arguments);
            },

            triggerDashboardAlertTracking: function (name, linkType) {
                return executeTrackingFunction("triggerDashboardAlertTracking_impl", arguments);
            },

            trackVideoChapterClick: function (videoName, courseName, chapterName) {
                return executeTrackingFunction("trackVideoChapterClick_impl", arguments);
            },

            trackHomepageTopicButtonLinks: function (contentElement, linkType) {
                return executeTrackingFunction("trackHomepageTopicButtonLinks_impl", arguments);
            },

            trackHomepageProductButtonLinks: function (contentElement, linkType) {
                return executeTrackingFunction("trackHomepageProductButtonLinks_impl", arguments);
            },

            trackRelatedCourseLinks: function (courseTitle, linkType) {
                return executeTrackingFunction("trackRelatedCourseLinks_impl", arguments);
            },

            trackOpenFreeActionsPopUp: function (popUpName, linkType) {
                return executeTrackingFunction("trackOpenFreeActionsPopUp_impl", arguments);
            },

            trackFreeActionPopUpClick: function (actionName, linkType) {
                return executeTrackingFunction("trackFreeActionPopUpClick_impl", arguments);
            },

            trackLearningPlanWidgetClick: function (navigationElement, linkType) {
                return executeTrackingFunction("trackLearningPlanWidgetClick_impl", arguments);
            },

            trackLearningPlanClick: function (navigationElement, courseName, learningPlanName, learningPlanSource, linkType) {
                return executeTrackingFunction("trackLearningPlanClick_impl", arguments);
            },

            trackDashboardLearningPlanClick: function (navigationElement, courseName, learningPlanName, learningPlanSource, linkType) {
                return executeTrackingFunction("trackDashboardLearningPlanClick_impl", arguments);
            },
            trackSignInNavigationClick: function (navigationElement, linkType) {
                return executeTrackingFunction("trackSignInNavigationClick_impl", arguments);
            },
            trackCourseAddedToLearningPlan: function (navigationElement, linkType) {
                return executeTrackingFunction("trackCourseAddedToLearningPlan_impl", arguments);
            }, trackAddedLearningPlan: function (learningPlanName, learningPlanType, linkType) {
                return executeTrackingFunction("trackAddedLearningPlan_impl", arguments);
            },
            trackLearningPlanDeleted: function (learningPlanName, learningPlanType, linkType) {
                return executeTrackingFunction("trackLearningPlanDeleted_impl", arguments);
            },
            trackSearchResultClick: function (contentName, linkType) {
                return executeTrackingFunction("trackSearchResultClick_impl", arguments);
            },

            trackOfferRegistrationClick: function (offerName) {
                return executeTrackingFunction("trackOfferRegistrationClick_impl", arguments);
            },
            trackOfferAuthenticationClick: function (offerName) {
                return executeTrackingFunction("trackOfferAuthenticationClick_impl", arguments);
            },
            trackPrivacyPopupClick: function (optionText) {
                return executeTrackingFunction("trackPrivacyPopupClick_impl", arguments);
            },
            UserRegistration: function () {
                executeTrackingFunction("UserRegistration_impl", arguments);
            },
            FinishLater: function () {
                executeTrackingFunction("FinishLater_impl", arguments);
            },
            trackLink: function (contentElement, linkType) {
                return executeTrackingFunction("trackLink_impl", arguments);
            },
            trackLiveEvents: function (contentElement, linkType) {
                return executeTrackingFunction("trackLiveEvents_impl", arguments);
            },
            trackBookName: function (bookCategory, bookTitle, fileFormat, linkType) {
                return executeTrackingFunction("trackBookName_impl", arguments);
            },
            trackCompanion: function (bookCategory, bookTitle, fileFormat, linkType) {
                return executeTrackingFunction("trackCompanion_impl", arguments);
            },
            trackEvaluationLinks: function (name, type) {
                return trackFileDownloadClick('additional material:"' + name, type, name);
            },
            trackRecommendSearchTerm: function (category, term) {
                saveRecommSearchTermCookie(category + ": " + term);
            },
            saveRecommSearchTermCookie: function (userSearchData) {
                $.cookie("user-search-data", userSearchData, { expires: 1, path: '/' });
            },
            deleteRecommSearchTermCookie: function () {
                $.cookie("user-search-data", '', { expires: 1, path: '/' });
            },
            getRecommSearchTermCookie: function () {
                var userSearchDataCookie = $.cookie("user-search-data");
                var recommSearch = '';
                if (typeof userSearchDataCookie != "undefined") {
                    recommSearch = (typeof userSearchDataCookie !== "undefined" && userSearchDataCookie != "") ? userSearchDataCookie : '';
                }
                return recommSearch;
            },
            trackDownloadTranscript: function (DownloadUrl) {
                mdo.pushEvent('linkClick', 'courseContent', {
                    'linkLocation': 'transcript',
                    'linkName': 'download transcript',
                    'linkUrl': DownloadUrl,
                    'playerType': 'Full player',
                    'hostUrl': ''
                });
            },
            trackDownloadTranscript: function (DownloadUrl) {
                mdo.pushEvent('linkClick', 'courseContent', {
                    'linkLocation': 'transcript',
                    'linkName': 'download transcript',
                    'linkUrl': DownloadUrl,
                    'playerType': 'Full player',
                    'hostUrl': ''
                });
            },

            createEmbedShareCookie: function () {
                $.cookie("embed-share", '', { expires: 365, path: '/' });
            },

            existsEmbedShareCookie: function () {
                var embedShareCookie = $.cookie("embed-share");
                if (typeof embedShareCookie != "undefined") {
                    return true;
                }
                return false;
            },

            trackRelatedCourseClick: function (CourseUrl, CourseID, CourseName) {
                mdo.pushEvent('relatedCourseClick', 'courseContent', {
                    'linkLocation': 'related course',
                    'linkName': getCoursePlayerFriendlyName(CourseID, CourseName),
                    'linkUrl': CourseUrl,
                    'playerType': 'Full player',
                    'hostUrl': ''
                });
                window.location.href = CourseUrl;
            },

            trackLearningPathBannerNavigation: function () {
                mdo.pushEvent('click', 'banner', {
                    'bannerName': 'learning paths'
                });
            }
        };

        return hf;

    })();

});
