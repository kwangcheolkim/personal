var microsoft = microsoft || {};
microsoft.learning = microsoft.learning || {};
microsoft.learning.mlx = microsoft.learning.mlx || {};

define(["jquery", "lodash", "jquerycookie"], function ($, _ ) {

    microsoft.learning.mlx.General =  {

        welcomePopUpSplashScreenDisplayed: false,
        slider: undefined,
        slidesWidth: 240,
        sliderTilePopular: undefined,
        sliderTileRecent: undefined,
        tileToSelect: 'developers',
        DefaultTileCategoryKey: 'developers',
        popupStatus: 0,

        notificationTypes: {
            SUCCESS: "success",
            ERROR: "error"
        },

        initializeHome: function () {
            $(document).ready(function () {
                $('.selectContent .contentSlide .personsLearning').click(function () {
                    var i = $(this).index();
                    $('.showSelectedContent').hide();
                    $('#article' + (i + 1)).show();
                });
                //checkIframeLoaded("twitter-widget-0");
                showPersonaContent(personaDefault, false);

                try { //Sometimes dot dot dot plugin throws errors. e.g. for russian articles with videos.
                    $('.newsDescriptionText').dotdotdot({});
                } catch (ex) {
                    //Nothing to do
                }

                $('.showSelectedContent .showContentSlide .defaultBox a .subLine.personas .bodyReverse').each(function () {
                    $(this).text(formatCourseDescription($(this).text()));
                });

                //SELECT CATEGORY
                if (window.location.hash) {
                    // hash found
                    var hash = window.location.hash.substring(1); //removes the # character
                    tileToSelect = hash;
                } else {
                    var categoryKey = location.search.replace("?category=", "");
                    var categoryIndex = categoryKeys.indexOf(categoryKey);
                    if (categoryIndex != -1) {
                        tileToSelect = categoryKey;
                    } else {
                        tileToSelect = getUserDataCookie().lastHomePageTileVisited;
                    }
                }

                if (tileToSelect == "imagine") {
                    $('.header-tiles .screenSmall').addClass('tilesBackground');
                    $('.header-tiles .screenSmall').removeClass('tilesBackgroundDefault');
                }

                saveLastHomePageTile(tileToSelect);
                setCourseCardsSlider(tileToSelect);

                $('.header-tiles .screenSmall').tabs({
                    active: tileToSelect ? $('.header-tiles .screenSmall .' + tileToSelect).index() : 0,
                    beforeActivate: function (event, ui) {
                        tileToSelect = ui.newPanel.selector.replace("#", "");
                        if (ui.newPanel.selector == '#imagine') {
                            $('.header-tiles .screenSmall').addClass('tilesBackground');
                            $('.header-tiles .screenSmall').removeClass('tilesBackgroundDefault');
                        }
                        else {
                            $('.header-tiles .screenSmall').removeClass('tilesBackground');
                            $('.header-tiles .screenSmall').addClass('tilesBackgroundDefault');
                        }

                        $('.mostRecentCourses .cards, .mostPopularCourses .cards').hide();
                        $('.mostRecentCourses .cards.' + ui.newPanel.selector.replace("#", "") + ', ' + '.mostPopularCourses .cards.' + ui.newPanel.selector.replace("#", "")).show();

                        setCourseCardsSlider(tileToSelect);

                        saveLastHomePageTile(tileToSelect);

                    }
                });

                /** Accessibility - Adds off screen text to tabs to inform the user of position **/
                var $hpTabs = $('.header-tiles .screenSmall li a'), $hpTabsL = $hpTabs.length;
                $hpTabs.each(function (i) {
                    $(this).append('<span class="sr"> ' + ++i + ' of ' + $hpTabsL + '</span>');
                });


                $('.mostRecentCourses .cards.' + tileToSelect + ', ' + '.mostPopularCourses .cards.' + tileToSelect).show();

                bannerSlider = $('.bxslider').bxSlider({
                    auto: true,
                    autoControls: true,
                    controls: false,
                    tickerHover: true,
                    useCSS: false,
                    easing: false,
                    autoHover: true,
                    onSlideBefore: function () {
                        $('.banner-container ul a').attr('tabindex', '-1');
                    },
                    onSlideAfter: function (element) {
                        $(element).find('a').attr('tabindex', '0');
                    }
                });

                $('.bxslider .item a').focus(function () {
                    bannerSlider.stopAuto();
                });

                $('.bxslider .item a').focusout(function () {
                    bannerSlider.startAuto();
                });

                slider = $('.see-nav').bxSlider({
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    auto: false,
                    autoControls: false,
                    controls: true,
                    minSlides: 1,
                    maxSlides: 5,
                    slideWidth: slidesWidth,
                    pager: false,
                    nextSelector: '.see-tabs #next',
                    prevSelector: '.see-tabs #prev',
                    nextText: 'Next',
                    prevText: 'Previous'
                });
                fixPersonasSlider();

                $(window).bind('resizeEnd', function () {
                    slider.destroySlider();
                    slider = $('.see-nav').bxSlider({
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        auto: false,
                        autoControls: false,
                        controls: true,
                        minSlides: 1,
                        maxSlides: 5,
                        slideWidth: slidesWidth,
                        pager: false,
                        nextSelector: '.see-tabs #next',
                        prevSelector: '.see-tabs #prev',
                        nextText: 'Next',
                        prevText: 'Previous'
                    });
                    fixPersonasSlider();

                    setCourseCardsSlider(tileToSelect);
                });

                $(window).resize(function () {
                    if (this.resizeTO) clearTimeout(this.resizeTO);
                    this.resizeTO = setTimeout(function () {
                        $(this).trigger('resizeEnd');
                    }, 500);
                });


                $('.see-tabs').tabs({
                    event: "mouseover"
                });
                var activeTab = $(".see-tabs").tabs("option", "active");

                $('#moveLeft').click(function () {
                    $('.see-tabs .ui-tabs-nav').animate({
                        'marginLeft': "-=270px" //moves left
                    });

                });
                $('#moveRight').click(function () {
                    $('.see-tabs .ui-tabs-nav').animate({
                        'marginLeft': "+=270px" //moves right
                    });

                });

                //Apply tracking to links in the personas section
                $("#see-others a:not(.see-nav a)").click(function (event) {
                    trackPersonasClick($(event.currentTarget));
                });

                $('.col-5.tall .circleBox').mouseenter(function () {
                    var string = $(this).closest('.col-5').attr('class').substr($('.col-5.tall').attr('class').indexOf("persona"));
                    var num = parseInt(string.match(/\d/)[0]);
                    showPersonaContent(num, false);
                });
            });
        },

        setCourseCardsSlider: function (tileToSelect) {
            $("[id$='hlMostRecentCourses']");

            if (sliderTilePopular !== undefined && sliderTileRecent != undefined) {
                sliderTileRecent.destroySlider();
                sliderTilePopular.destroySlider();
            }

            if (window.innerWidth < 768) {
                sliderTileRecent = $('.mostPopularCourses ul.' + tileToSelect).bxSlider({
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    auto: false,
                    autoControls: false,
                    controls: true,
                    minSlides: 1,
                    maxSlides: 1,
                    slideWidth: 200,
                    pager: false,
                    nextSelector: $('.mostPopularCourses #next-' + tileToSelect),
                    prevSelector: $('.mostPopularCourses #prev-' + tileToSelect),
                    nextText: 'Next',
                    prevText: 'Previous'
                });

                sliderTilePopular = $('.mostRecentCourses ul.' + tileToSelect).bxSlider({
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    auto: false,
                    autoControls: false,
                    controls: true,
                    minSlides: 1,
                    maxSlides: 1,
                    slideWidth: 200,
                    pager: false,
                    nextSelector: $('.mostRecentCourses #next-' + tileToSelect),
                    prevSelector: $('.mostRecentCourses #prev-' + tileToSelect),
                    nextText: 'Next',
                    prevText: 'Previous'
                });
            }
        },

        fixPersonasSlider: function () {
            var width = window.innerWidth;
            var wrapper = $('#see-others .bx-wrapper')

            if (width > 1215)
                wrapper.css('max-width', 1200 + 'px');
            else if (width < 1216 && width > 989)
                wrapper.css('max-width', 960 + 'px');
            else if (width < 990 && width > 777)
                wrapper.css('max-width', 720 + 'px');
            else if (width < 778 && width > 551)
                wrapper.css('max-width', 480 + 'px');
            else if (width < 550)
                wrapper.css('max-width', 240 + 'px');
        },

        formatCourseDescription: function (encodedText) {
            if (encodedText.length >= 50) {
                if (parseInt(countryId) == 2) {
                    var encodedText = encodedText.substring(0, 30) + "...";
                }
                else {
                    var str = encodedText.substring(0, 45);
                    var encodedText = str.substring(0, str.lastIndexOf(" ")) + "...";
                }
            }
            else if (encodedText.length >= 30 && parseInt(countryId) == 2) {
                var encodedText = encodedText.substring(0, 30) + "...";
            }

            return encodedText;
        },

        goToTop: function (evt) {
            evt.preventDefault();
            $('body,html').animate({
                scrollTop: 0,
            }, 700
            );
        },

        movePersonaCaraousel: function (event) {
            var string = $('.contentSlide .owl-item.active').first().children().attr("class").substr($('.col-5.tall.selected').attr("class").indexOf("persona"));
            var num = parseInt(string.match(/\d/)[0]);
            showPersonaContent(num, false);
        },

        showPersonaContent: function (num, trackPersona) {
            if (typeof (trackPersona) == 'undefined') {
                trackPersona = true;
            }

            if (!$('col-5.tall.persona-' + num).hasClass("selected")) {
                $('.col-5.tall').removeClass("selected");
                $('.col-5.tall.persona-' + num).addClass("selected");
                $('.showSelectedContent').removeClass("showContent");
                $('.showSelectedContent.persona-' + num).addClass("showContent");
                $('.showSelectedContent.persona-' + num).fadeIn("slow");

                //Tracking
                if (trackPersona) {
                    var personaTitle = $(".subHeadlineLink", '.col-5.tall.persona-' + num).html();
                    trackNavigationClick("home:personas:" + personaTitle, "o");
                }
            }
        },

        showNextPersona: function () {
            var personasOwl = $(".contentSlide").data('owlCarousel');
            personasOwl.next();
        },

        showPreviousPersona: function () {
            var personasOwl = $(".contentSlide").data('owlCarousel');
            personasOwl.prev();
        },

        // Save last home page tile in cookies to show it when return to home.
        // Also set tab in PageLoadTrackingOptions to track selected tab.
        saveLastHomePageTile: function (key) {
            var userDataCookie = getUserDataCookie();
            userDataCookie.lastHomePageTileVisited = key;
            saveUserDataCookie(userDataCookie);

            if (typeof (PageLoadTrackingOptions) != 'undefined') {
                PageLoadTrackingOptions.PageName = "home|" + key;
            }
        },

        getCoursePlayerFriendlyName: function (courseId, courseName) {
            var friendlyName = courseName.toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-')
                .replace('.', '-')
                .replace(',', '-');

            return friendlyName + '-' + courseId;
        },

        saveUserDataCookie: function (userData) {
            $.cookie("user-data", JSON.stringify(userData), { expires: 365, path: '/' });
        },

        getUserDataCookie: function () {
            var userDataCookie = $.cookie("user-data");

            var data = {
                lastHomePageTileVisited: this.DefaultTileCategoryKey ? this.DefaultTileCategoryKey : '',
                languagePreferences: '',
                UILanguage: '',
                updatedLanguagePreferences: false
            };

            if (typeof userDataCookie != "undefined") {
                var _userDataCookie = JSON.parse(userDataCookie);
                data.lastHomePageTileVisited = (typeof _userDataCookie.lastHomePageTileVisited !== "undefined" && _userDataCookie.lastHomePageTileVisited != "") ? _userDataCookie.lastHomePageTileVisited : data.lastHomePageTileVisited;
                data.languagePreferences = typeof _userDataCookie.languagePreferences !== "undefined" ? _userDataCookie.languagePreferences : data.languagePreferences;
                data.UILanguage = typeof _userDataCookie.UILanguage !== "undefined" ? _userDataCookie.UILanguage : data.UILanguage;
                data.updatedLanguagePreferences = typeof _userDataCookie.updatedLanguagePreferences !== "undefined" ? (_userDataCookie.updatedLanguagePreferences == "False" ? false : _userDataCookie.updatedLanguagePreferences) : (data.updatedLanguagePreferences);
            }

            return data;
        },


        ////////////////////////////////////////
        //COURSE PLAYER
        ////////////////////////////////////////

        /* Course rating */
        descontar: function (control) {
            $(".chars-remaining span").html($("[id$='HiddenFieldCharsRemaining']").val() - $("#ratingsPopup [id$='txtComments']").val().length);
        },

        setStars: function (number) {
            $('input[id$=HiddenFieldRating]').val(number);
        },

        disableRatingPopup: function (cssClass) {
            $('.video-player').show();
            disablePopup(cssClass);
        },

        trackIsRated: function (sender, args) {
            var number = $('input[id$=HiddenFieldRating]').val();
            args.IsValid = (number > 0) && (number <= 5);
        },

        //Topic pages

        InitializeTopicsPage: function () {
            //Initialize Topics Banner Carousel
            if ($('.owl-carousel.topicBanners').length > 0) {
                if ($('div.item', '.owl-carousel.topicBanners').length == 1) {
                    $('.owl-carousel.topicBanners').show();
                } else {
                    var owlBanners = $('.owl-carousel.topicBanners');
                    owlBanners.owlCarousel({
                        singleItem: true,
                        autoPlay: 5000,
                        stopOnHover: true,
                        items: 3,
                        transitionStyle: "fade"
                    });
                }
            }

            //Set by default the aside addiontal resources
            if ($('.resources-container').length > 0) {
                showTopicResourcesTab();
            }
            else if ($('.careers-container').length > 0) {
                showTopicCareersTab();
            }
            else if ($('.books-container').length > 0) {
                showTopicBooksTab();
            }



            $(window).resize(function () {
                if ($(".topic-filters .arrange-popup").css("display") != "none") {
                    if (window.innerWidth < mediaQuerieMobile) {
                        if (lastWidth >= mediaQuerieMobile && actualWidth < mediaQuerieMobile) {
                            showPopupBackground(true);
                        }

                        $(".topic-filters .arrange-popup").width(window.innerWidth - 10);
                        $(".topic-filters .arrange-popup").css("right", "-10px");
                    } else {
                        $(".topic-filters .arrange-popup").width("");
                        hidePopupBackground();
                    }
                }

                if (actualWidth < mediaQuerieMobile && $("#topicPage-container .topic-version-nav .topic-versions").css("display") != "none") {
                    $("#topicPage-container .topic-version-nav .topic-versions").width(window.innerWidth - 10);
                }

                //From Mobile to Tablet
                if (lastWidth < mediaQuerieMobile && actualWidth >= mediaQuerieMobile) {
                    if ($("#topicPage-container .topic-version-nav .topic-versions").css("display") != "none") {
                        closePopups(true, true);
                    }
                    $("#topicPage-container .topic-version-nav .topic-versions").show();
                    $("#topicPage-container .topic-version-nav .topic-versions").width("");
                }

                if (lastWidth >= mediaQuerieMobile && actualWidth < mediaQuerieMobile) {
                    $("#topicPage-container .topic-version-nav .topic-versions").hide();
                }

                if (actualWidth <= 1366 && lastWidth > 1366) {
                    $("#social-bar").hide();
                } else {
                    if (actualWidth > 1366 && lastWidth <= 1366) {
                        $("#social-bar").show();
                    }
                }

            });

            if ($('#aside-container').length == 0) {
                $('#mainContent-topicPage').toggleClass("aside-disabled");
            }
            if ($('.topic-banner').length == 0) {
                $('#aside-container .aside-header').css("margin-top", "0px");
            }
        },


        dropDownMenu: function (selectedText) {
            if (selectedText) {
                $('.arrange-selected').html(selectedText);
                closePopups(true, true);
                return;
            }

            if (window.innerWidth < mediaQuerieMobile) {
                if ($(".topic-filters .arrange-popup").css("display") != "none") {
                    closePopups(true, true);
                } else {
                    $(".topic-filters .arrange-popup").slideToggle();
                    $(".topic-filters .arrange-popup").width(window.innerWidth - 10);
                    showPopupBackground(true);
                }
            } else {
                $(".topic-filters .arrange-popup").width("");
                $(".topic-filters .arrange-popup").slideToggle();
            }
        },

        versionDropDownMenu: function () {
            if ($("#topicPage-container .topic-version-nav .topic-versions").css("display") != "none") {
                closePopups(true, true);
            } else {
                $("#topicPage-container .topic-version-nav .topic-versions").css("display", "block");
                $("#topicPage-container .topic-version-nav .topic-versions").width(window.innerWidth - 10);
                showPopupBackground(true);
            }
        },

        topicVersionSetActive: function (key) {

            var versionToShow = $('a[name="' + key + '"]');
            if (versionToShow.length == 0) {
                key = selectedVersionId;
                var versionToShow = $('a[name=' + key + ']');
            }

            if (!versionToShow.hasClass("active")) {
                $('.topic-versions a').removeClass("active");
                versionToShow.toggleClass("active");
            }

            hidePopupBackground();
        },

        showTopicBooksTab: function () {
            $('#aside-container .aside-header .aside-nav .tags h2').removeClass('active');
            $('.careers-container').hide();
            $('.resources-container').hide();
            $('#aside-container .aside-header .aside-nav .tags .books').addClass('active');
            $('.books-container').show();
        },

        showTopicCareersTab: function () {
            $('#aside-container .aside-header .aside-nav .tags h2').removeClass('active');
            $('.books-container').hide();
            $('.resources-container').hide();
            $('#aside-container .aside-header .aside-nav .tags .career').addClass('active');
            $('.careers-container').show();
        },

        showTopicResourcesTab: function () {
            $('#aside-container .aside-header .aside-nav .tags h2').removeClass('active');
            $('.books-container').hide();
            $('.careers-container').hide();
            $('#aside-container .aside-header .aside-nav .tags .resources').addClass('active');
            $('.resources-container').show();
        },

        /*
         * POPUPS
        */



        //loading popup with jQuery magic!
        loadPopup: function (target) {
            //loads popup only if it is disabled
            if (popupStatus == 0) {
                target.fadeIn("normal", function () {
                    $('#star2').focus();
                });
                popupStatus = 1;
            }
        },

        //disabling popup with jQuery magic!
        disablePopup: function (target) {
            //disables popup only if it is enabled
            if (popupStatus == 1) {
                $(".IFramePopUp").fadeOut("normal");
                $('.popupBackground').fadeOut();
                $(".backgroundPopup").fadeOut("normal",
                    function () {
                        jQuery(this).remove();
                    });
                target.fadeOut("normal");
                popupStatus = 0;
            }

            $("body").css("overflow", "");
        },

        showPopup: function (cssClass, noAlignment) {
            var isFreeActionPopup = cssClass.indexOf("FreeActions") != -1;
            var mask = popup_createMask();
            mask.fadeIn(1000, function () {
                if (!noAlignment)
                    centerPopup($("." + cssClass), isFreeActionPopup);
                loadPopup($("." + cssClass));
            });
        },

        showRatingPopup: function (cssClass) {
            showPopup(cssClass);
        },

        showFreeActionPopup: function (cssClass, popUpName, linkType) {
            $('.video-player').hide();
            showPopup(cssClass);
            trackOpenFreeActionsPopUp(popUpName, linkType);
        },

        popup_createMask: function () {
            // create mask
            var mask = jQuery("<div class='backgroundPopup'></div>");
            mask.appendTo("body");

            //Set height and width to mask to fill up the whole screen
            mask.css({
                'height': '100%',
                'width': '100%',
                'opacity': 0.5,
                'position': 'fixed'
            });
            return mask;
        },

        showPopUpViewContentToRate: function () {
            var popup = $('.popUpViewContentToRate');
            if (popup.css('display') == 'none') {
                popup.fadeIn();
            } else {
                popup.fadeTo('slow', 0.5).fadeTo('slow', 1.0);
            }
        },

        //Centering popup
        centerPopup: function (target, isFreeActionPopup) {
            //request data for centering
            var popupHeight = target.outerHeight();
            var popupWidth = target.outerWidth();

            //centering
            if ($(window).width() <= 641 && isFreeActionPopup) /* Mobile version */ {
                target.css({
                    "top": "0",
                    "left": "0",
                    "margin": "0",
                    "width": "100%",
                    "height": "100%",
                    "padding": "0px",
                    "position": "fixed",
                    "overflow-y": "auto",
                    "overflow-x": "hidden"
                });
            }
            else {
                target.css({
                    "top": "50%",
                    "left": "50%",
                    "position": "fixed",
                    "margin-top": -popupHeight / 2,
                    "margin-left": -popupWidth / 2
                });
            }
        },

        checkClosedCaptionFeatureSupport: function () {
            if (!document.createElement('track').track) {
                //Show message that the browser does't support this feature
                $('#closed-captions-not-supported').show();
                return false;
            }
            return true;
        },

        closeLoginPopup: function () {
            //Hide popup
            $('.popUpLogin').fadeOut();
            //Hide overlay and unblock scroll
            $('.popupLoginBackground').fadeOut();

            $('.popupBackground').fadeOut();
        },


        /* FREE ACTIONS POP UP */
        snooze: function (dnsSafeHost) {
            value = getValueFromCookie('FreeActions');

            if (value.indexOf('snooze=') < 0) {
                document.cookie = 'FreeActions=.;path=/;domain=' + dnsSafeHost + ';expires=Wed, 1 Jan 2000 00:00:00 UTC;';

                disablePopup($('.freeActionsPopUp'));
                $('.video-player').show();
                return;
            }

            snoozeIndex = value.indexOf('snooze=') + 7;
            pipeIndex = value.indexOf('|', snoozeIndex);
            snoozeCount = value.substr(snoozeIndex, pipeIndex - snoozeIndex);

            if (isNaN(snoozeCount)) {
                document.cookie = 'FreeActions=.;path=/;domain=' + dnsSafeHost + ';expires=Wed, 1 Jan 2000 00:00:00 UTC;';

                disablePopup($('.freeActionsPopUp'));
                $('.video-player').show();
                return;
            }
            else {
                snoozeCount++;
            }

            newValue = value.substr(0, snoozeIndex) + snoozeCount + value.substr(pipeIndex);

            document.cookie = 'FreeActions=' + newValue + ';path=/;domain=' + dnsSafeHost + ';expires=Wed, 1 Jan 2020 00:00:00 UTC;';

            disablePopup($('.freeActionsPopUp'));
            $('.video-player').show();
        },

        /* Get value from cookie by name */
        getValueFromCookie: function (cookieName) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(cookieName + "=");
                if (c_start != -1) {
                    c_start = c_start + cookieName.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                    return document.cookie.substring(c_start, c_end);
                }
            }
            return "";
        },

        arrayToCookieValue: function (array) {
            newValue = "";

            $.each(array, function (i, v) {
                newValue += i + "=" + v + '|';
            });

            return newValue.toString();
        },

        getArrayValuesFromCookie: function (cookieName) {
            _values = getValueFromCookie(cookieName).split('|');

            values = {};
            $.each(_values, function (i, v) {
                if ((v.split('=')[0]))
                    values[v.split('=')[0]] = v.split('=')[1];
            });

            return values;
        },

        /* Set a cookie */
        setFreeActionsCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';path=/;domain=' + window.location.host + ';expires=Wed, 1 Jan 2020 00:00:00 UTC;';
        },

        getRegisterMemberCookie: function (cookieName) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(cookieName + "=");
                if (c_start != -1) {
                    return true;
                }
            }
            return false;
        },

        decrementFeedbackRemainingChars: function () {
            $("#feedback-chars-remaining span").html($("[id$='HiddenFieldFeedbackCharsRemaining']").val() - $("[id$='txtContent']").val().length);
        },

        showFeedbackPopUpMessage: function () {
            $('.video-player').hide();
            showPopup("popUpMessage");
        },

        CloseFeedbackPopUp: function () {
            $('.video-player').show();
            disablePopup($(".popUpMessage"));
        },

        getQueryParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        ////////////////////////////
        //LEARNING PLAN USER CONTROL
        ////////////////////////////
        toggleLearningPlanCallout: function (courseId) {
            var calloutElement = $('#learningPlansCallout-' + courseId);
            var showCallout = !calloutElement.is(':visible');
            var calloutButton = $(calloutElement).closest('.add-learning-plan-container');

            if (showCallout) {

                $("[id^=learningPlansCallout-]").hide();

                calloutElement.show();
                $(calloutButton).addClass("calloutActive");

                calloutButton.mouseleave(function () {
                    if ($(calloutElement).css("display") == "block" && $(calloutButton).hasClass("calloutActive")) {
                        $('#learningPlansCallout-' + courseId).hide();
                        $(calloutElement).closest('.add-learning-plan-container').unbind('mouseleave');
                        $(calloutElement).closest('.add-learning-plan-container').removeClass("calloutActive");
                    }
                });

                calloutElement.mouseleave(function () {
                    $('#learningPlansCallout-' + courseId).hide();
                    $('#learningPlansCallout-' + courseId).unbind('mouseleave');
                    $(calloutElement).closest('.add-learning-plan-container').removeClass("calloutActive");
                });
            } else {
                calloutElement.hide();
            }
        },

        /****** OTHER HELPFUL METHODS ******/
        getIDsArray: function (arrayName, itemPrefix) {
            var rawIDs = $(arrayName).sortable("toArray", { attribute: "id" });
            var sortedIDs = new Array();

            $.each(rawIDs, function (index) {
                var charIndex = this.indexOf(itemPrefix) + itemPrefix.length;
                sortedIDs[index] = this.substr(charIndex);
            });

            return sortedIDs;
        },

        //Check Iframe Twitrer
        checkIframeLoaded: function (id) {
            var iframe = document.getElementById(id);

            if (iframe) {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // Check if loading is complete
                if (iframeDoc.readyState == 'complete') {
                    $("#" + id + "").contents().find('.timeline').css('max-width', '1000px');
                    return;
                }
            }
            window.setTimeout('checkIframeLoaded("' + id + '");', 2000);
        },

        /* NOTIFICATIONS */

        validateAnyHTMLtag: function (message, status) {
            var valid = true;
            $('input').each(function () {
                if ($(this).val().match(/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/) || $(this).val().match(/<\/?[^>]*>/)
                    || $(this).val().match(/[;<>\{\}]/)) {
                    showNotification(message, notificationTypes.ERROR);
                    valid = false;
                }
            });
            if (valid == true) {
                if (status == "create") {
                    registerUser();
                }
                else if (status == "update") {
                    updateUser();
                }
                if (confirmed !== undefined)
                    confirmed = true;
            }
            return valid;
        },


        CallAJAXPost: function () {
            var successFN = CallAJAXPost.arguments[CallAJAXPost.arguments.length - 2];
            var errorFN = CallAJAXPost.arguments[CallAJAXPost.arguments.length - 1];
            var baseURL = $('#hfBaseURL').attr("value");
            var url = baseURL + CallAJAXPost.arguments[0];
            var params = CallAJAXPost.arguments[1];


            $('div[id$="_uProgress"]').fadeIn(1);

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(params),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    successFN(msg.d);
                },
                error: function (msg) {
                    errorFN(msg);
                    showNotification($("#hfDefaultErrorMessage").val(), notificationTypes.ERROR)
                }
            });
        },

        showNotification: function (message, type) {
            $(document).ready(function () {
                // get existing popup dom element and remove it from dom
                var notificationPopup = $("#notificationPopup");
                if (notificationPopup.length) {
                    notificationPopup = notificationPopup.remove();
                }
                // create new popup dom element
                notificationPopup =
                $("<div id='notificationPopup'>" +
                    "<span id='notificationPopup-message'></span>" +
                    "</div>");
                notificationPopup.appendTo("#content");
                //set message
                notificationPopup.find("#notificationPopup-message").html(message);
                // clear notification types from class attr
                notificationPopup.removeClass(notificationTypes.INFO);
                notificationPopup.removeClass(notificationTypes.ERROR);
                // add notification type class
                notificationPopup.addClass(type);
                // show and hide after a few seconds
                notificationPopup.fadeIn(1000).delay(7000).fadeOut(500);
            });
        },

        /*********************************************************
            SEARCH & PRODUCT/TOPIC PAGES COMMON FUNCTIONS
        **********************************************************/
        getDateDiffString: function (sourceDate) {
            var PublishDate = sourceDate;
            var reg = /\d+/g;
            if (sourceDate == null || sourceDate == undefined) {
                return "";
            }
            if (typeof (PublishDate) === "string") {

                var date = _.startsWith(sourceDate, "/Date(") ? parseInt(reg.exec(sourceDate)) : sourceDate;
                PublishDate = new Date(date);

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
        },

        getAggregateValue: function (averageValue) {
            var aggregateValue = null;
            if (averageValue != null) {
                if (averageValue.toString().indexOf(".") != 0) {
                    var roundValue = parseFloat(averageValue).toFixed(1);
                    var firstValue = roundValue.split(".")[0];
                    var decimalValue = roundValue.split(".")[1];
                    if (decimalValue < 5) {
                        aggregateValue = Math.round(averageValue);
                    }
                    else if (decimalValue >= 5) {
                        aggregateValue = parseFloat(firstValue.toString() + ".5");
                    }
                }
                else {
                    aggregateValue = averageValue;
                }
            }
            return aggregateValue;
        },

        removeTagsCourseDescription: function (description) {
            if (description != null)
                var newDescription = description.replace(/(<([^>]+)>)/ig, "");

            return newDescription;
        },

        escapeSpecialCharacters: function (text) {
            return text.replace(/[^\w\s]/gi, '');
        },

        boldSearchTerms: function (text, searchTerm) {
            var re = '(^|\\s)({Term})(.*?)(\\s|$)';
            var replaceMask = '$1<span>$2</span>$3$4';
            var result = text;

            // Replaces all spaces with '$'
            var _searchTerm = searchTerm.replace(/ +/g, '$');
            // Generates an array of terms
            var terms = _searchTerm.split('$');

            for (var i = 0; i < terms.length; i++) {
                var term = this.escapeSpecialCharacters(terms[i]);
                if (term.toLowerCase() !== "span") {
                    var regEx = new RegExp(re.replace("{Term}", term), "ig");
                    result = result.replace(regEx, replaceMask);
                }
            }

            return result;
        },

        getLanguageNameByLCID: function (lcid) {
            var _lcid = parseInt(lcid);

            if (_lcid > 0 && Languages) {
                for (var i = 0; i < Languages.length; i++)
                    if (Languages[i].LCID == parseInt(_lcid)) return Languages[i].Name;
            }

            return "";
        },

        getLevelName: function (levelValue) {
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
        },

        showMigrationPopUp: function (cssClass, trackingMsjType, trackingMsjCode, trackingMsjText) {
            if (trackingMsjType || trackingMsjCode || trackingMsjText)
                this.trackSysMessage(trackingMsjType, trackingMsjCode, trackingMsjText)

            $("body").css("overflow", "hidden");
            this.showPopup(cssClass, true);
        },

        Display: function () {
            this.showPopup('popUpSaveChanges', true);
        },

        /* ---------- Merge Anonymous course activities with migrated profiled user -------------------*/
        deleteFreeActions: function () {
            document.cookie = 'FreeActions=;path=/;domain=' + window.location.host + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },

        getAnonGUID: function () {
            var userGUID = this.getValueFromCookie('FreeActions');
            if (userGUID.trim().length > 0) {
                userGUID = userGUID.substr(0, userGUID.indexOf("|"));
                return userGUID.substr("guid=".length);
            }
            return "";
        },

        mergeAnonymousActivitiesMigratedUser: function (mergeCallBack) {

            if (MLX.context.currentUser.currentUserId > 0) {
                var userGUID = this.getValueFromCookie('FreeActions');
                var freeActionsCount = 0;
                var url = "https://{MvaApiHost}/api/{GUID}/{userID}/mergeAnonymousActivities";

                userGUID = userGUID.substr(0, userGUID.indexOf("|"));
                userGUID = userGUID.substr("guid=".length);

                if (userGUID != "") {
                    freeActionsCount = this.getArrayValuesFromCookie('FreeActions').count;
                }

                if (freeActionsCount > 0) {
                    url = url.replace("{MvaApiHost}", Configurations.mvaApiTargetHostname);
                    url = url.replace("{GUID}", userGUID);
                    url = url.replace("{userID}", MLX.context.currentUser.currentUserId);

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {},
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (msg) {
                            //Delete free actions after success call
                            deleteFreeActions();
                            if (mergeCallBack) mergeCallBack();
                        }
                    });
                }
                else {
                    if (mergeCallBack) mergeCallBack();
                }
            }
            else {
                if (mergeCallBack) mergeCallBack();
            }
        },

        /*
            COLLAPSIBLE TEXT PANELS
        */
        initializeTextPanel: function (controlID, lines) {
            if ($("#" + controlID).length > 0) {
                var contentHeight = $("#" + controlID).height();
                var lineHeight = ($("#" + controlID).css("line-height") != 'normal') ? $("#" + controlID).css("line-height").replace('px', '') : 19;
                lineHeight = Math.round(lineHeight);

                if (contentHeight <= (lines * lineHeight)) {
                    $("#" + controlID + "-read-more").css("display", "none");
                    $("#" + controlID + "-read-less").css("display", "none");
                    $("#" + controlID + "-buttons").empty();
                }
                else {
                    $("#" + controlID).height(lines * lineHeight);
                    $("#" + controlID + "-read-more").css("display", "block");
                    $("#" + controlID + "-read-less").css("display", "none");
                }
            }
        },

        collapseTextPanel: function (controlID, lines) {
            var contentHeight = $("#" + controlID + "-inner").height();
            var lineHeight = ($("#" + controlID).css("line-height") != 'normal') ? $("#" + controlID).css("line-height").replace('px', '') : 19;
            lineHeight = Math.round(lineHeight);

            $("#" + controlID).height(lines * lineHeight);
            $("#" + controlID + "-read-more").css("display", "block");
            $("#" + controlID + "-read-less").css("display", "none");
        },

        expandTextPanel: function (controlID) {
            var contentHeight = $("#" + controlID + "-inner").height();

            $("#" + controlID).height(contentHeight);
            $("#" + controlID + "-read-more").css("display", "none");
            $("#" + controlID + "-read-less").css("display", "block");
        },

        SaveAnonymousUserDetailsInTableStore: function () {
            if (MLX.context.currentUser.currentUserId > 0) {
                var cookieValue = getValueFromCookie('RegAnonymousApiInProgress');
                var isApiInProgress = false;
                if (cookieValue == "") {
                    setFreeActionsCookie('RegAnonymousApiInProgress', false, 1);
                }
                else {
                    isApiInProgress = (cookieValue === "true");
                }
                var userGUID = getValueFromCookie('FreeActions');
                var freeActionsCount = 0;
                var url = "https://{MvaApiHost}/api/{GUID}/{userId}/reganonymous";

                var userAnonymousGuid = getValueFromCookie('AnonymouseUserLog');

                userGUID = userGUID.substr(0, userGUID.indexOf("|"));
                userGUID = userGUID.substr("guid=".length);

                if (userGUID != "") {
                    freeActionsCount = getArrayValuesFromCookie('FreeActions').count;
                }

                url = url.replace("{MvaApiHost}", Configurations.mvaApiTargetHostname);
                url = url.replace("{GUID}", userGUID);
                url = url.replace("{userId}", MLX.context.currentUser.currentUserId);

                if (userGUID != "" && userAnonymousGuid != userGUID && isApiInProgress == false) {
                    setFreeActionsCookie('RegAnonymousApiInProgress', true, 1);
                    $.ajax({
                        type: "PUT",
                        url: url,
                        data: {},
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (msg) {
                            if (!(freeActionsCount > 0)) {
                                deleteFreeActions();
                                setFreeActionsCookie('RegAnonymousApiInProgress', false, 1);
                            }

                            document.cookie = 'AnonymouseUserLog=' + userGUID + ';path=/;domain=' + window.location.host + ';expires=Thu, 01 Jan 2020 00:00:01 GMT;';
                        },
                        error: function (msg) {
                            setFreeActionsCookie('RegAnonymousApiInProgress', false, 1);
                        }
                    });
                }
            }
        },

        /*
            LANDING PAGE
        */
        setHeightForIFrame: function () {
            $('iframe[id$="iLandingPage"]').load(function () {
                this.style.height = (this.contentWindow.document.body.scrollHeight + 60) + 'px';
            })
        },

        /*
            EMBEDDED PLAYER
        */
        openRedirectToMVAPopup: function (event, anchor) {
            event.preventDefault();
            $('#okToRedirectToMVA').attr("href", $(anchor).attr("href"));
            showLoginPopup('popUpRedirectToMVA');
        },

        showJoinPopup: function () {
            $(".joinPopupCont").show();
        },

        hideJoinPopup: function () {
            $(".joinPopupCont").hide();
        },

        newSizeDescriptionProductTopicPage: function () {
            var height = 0;
            var outerHeight = $(window).outerHeight();
            var footerHeight = $('footer').height();
            var headerHeight = $('header').height();
            var heightVariable = $('#allDescription p').height() - $('#allDescription').height();

            if ($(window).width() >= Configurations.tabletResolution) {
                height = outerHeight - (footerHeight + headerHeight + $('.product-topic-header').outerHeight() + 100);
                $('footer').show();
            }
            else {
                height = outerHeight - (headerHeight + $('.product-topic-header').outerHeight() + 100);
                $('footer').hide();
            }

            $('#searchResultsContainer').css('height', height + "px");
            if ($('#showHideDescription').hasClass('showAllDescription')) {
                $('#content').css('height', heightVariable);
            }
        },

        descriptionSwitchShowHide: function () {
            if ($('#showHideDescription').hasClass('showAllDescription')) {
                $('#showHideDescription').removeClass("showAllDescription").addClass("hideAllDescription").text(ResourceStrings.ShowLess);
                $('#product-topic-container .product-topic-header .header-banner .description').addClass('no-after yes-after');
            } else {
                $('#showHideDescription').removeClass("hideAllDescription").addClass("showAllDescription").text(ResourceStrings.ShowAll);
                $('#product-topic-container .product-topic-header .header-banner .description').removeClass('no-after yes-after');
            }

            newSizeDescriptionProductTopicPage();
            var outerHeight = $(window).outerHeight();
            var endHeight = (outerHeight - $('.description').height() - $('footer').height());
            $('#productTopicDetailsView').css('height', endHeight + 'px');
        },

        showOrHideButtonDescriptionProductTopic: function () {
            if ($('#allDescription p').height() < 71) {
                $('.lbl-all-description').css('display', 'none');
            } else {
                $('.lbl-all-description').css('display', 'block');
            }
        }

    };

});