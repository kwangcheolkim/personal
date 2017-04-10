var microsoft = microsoft || {};
microsoft.learning = microsoft.learning || {};
microsoft.learning.mlx = microsoft.learning.mlx || {};

define(["knockout"], function (ko) {

    microsoft.learning.mlx.OverlayViewModels = (function () {

        var obj = function () {
            var self = this;

            self.busyIndicator = new microsoft.learning.mlx.Overlay_BusyloaderIndicatorViewModel();
            self.busyIndicator = undefined,
            self.busyIndicatorMessage = undefined,
            self.welcomeMessage = undefined,
            self.courseAddMessage = undefined,
            self.coursePlayerOverlayModel = undefined,
            self.coursePlayerNotificationOverlayModel = undefined,
            self.notificationDialog = undefined,
            self.removedNotificationDialog = undefined,
            self.busyIndicatorMessageSupport = undefined,
            self.resignDialog = undefined,
            self.customMessage = undefined,
            self.errorDialog = undefined,
            self.confirmDialog = undefined,
            self.errorAuthDialog = undefined,
            self.retirementNotification = undefined;
        };


        // Course-Added confirmation message view model
        obj.prototype = {


            GetBusyIndicator: function () {
                if (!busyIndicator) {
                    busyIndicator = new Overlay_BusyloaderIndicatorViewModel();
                    if ($("#overlay").get(0)) {
                        ko.applyBindings(busyIndicator, $("#overlay").get(0));
                    }

                }
                return busyIndicator;
            },

            GetBusyIndicatorMessage: function () {
                if (!this.busyIndicatorMessage) {

                    this.busyIndicatorMessage = new microsoft.learning.mlx.Overlay_BusyloaderIndicatorViewModel();

                    if ($("#divAjaxloaderControl").get(0)) {
                        ko.applyBindings(this.busyIndicatorMessage, $("#divAjaxloaderControl").get(0));
                    }
                };

                return this.busyIndicatorMessage;
            },

            GetBusyIndicatorMessageSupport: function () {
                if (!this.busyIndicatorMessageSupport) {
                    this.busyIndicatorMessageSupport = new Overlay_BusyloaderIndicatorViewModel();
                    if ($("#divAjaxloaderControlUnAuth").get(0)) {
                        ko.applyBindings(this.busyIndicatorMessageSupport, $("#divAjaxloaderControlUnAuth").get(0));
                    }
                }
                return this.busyIndicatorMessageSupport;
            },

            GetWelcomeMessage: function () {
                if (!this.welcomeMessage) {
                    this.welcomeMessage = new Overlay_WelcomeMessageViewModel();
                    if ($("#divWelcomeMessage").get(0)) {
                        ko.applyBindings(this.welcomeMessage, $("#divWelcomeMessage").get(0));
                    }
                }
                return this.welcomeMessage;
            },

            GetCourseAddOverlay: function () {
                if (!this.courseAddMessage) {
                    this.courseAddMessage = new Overlay_CourseAddedViewModel();
                    if ($("#divCourseAddedConfirmation").get(0)) {
                        ko.applyBindings(courseAddMessage, $("#divCourseAddedConfirmation").get(0));
                    }
                }
                return courseAddMessage;
            },

            GetCoursePlayerOverlay: function () {
                if (!this.coursePlayerOverlayModel) {
                    this.coursePlayerOverlayModel = new Overlay_BusyloaderIndicatorViewModel();
                    if ($("#course-player-overlay").get(0)) {
                        ko.applyBindings(this.coursePlayerOverlayModel, $("#course-player-overlay").get(0));
                    }
                }

                return this.coursePlayerOverlayModel;
            },

            GetCoursePlayerNotificationOverlay: function (messageHeading, btnText) {
                if (!coursePlayerNotificationOverlayModel) {
                    var coursePlayerNotificationOverlayModel = new Overlay_NotificationViewModel(messageHeading, btnText);
                    if ($("#course-player-notification-overlay").get(0)) {
                        ko.applyBindings(coursePlayerNotificationOverlayModel, $("#course-player-notification-overlay").get(0));
                    }
                }

                return coursePlayerNotificationOverlayModel;
            },

            GetNotification: function (notificationMessage, btnText) {
                if (!notificationDialog) {
                    notificationDialog = new Overlay_NotificationViewModel(notificationMessage, btnText, this);
                    ko.applyBindings(notificationDialog, $("#divCourseAddedConfirmation").get(0));
                }
                return notificationDialog;
            },

            GetRemovedNotification: function (notificationMessage, btnText) {
                if (!removedNotificationDialog) {
                    removedNotificationDialog = new Overlay_NotificationViewModel(notificationMessage, btnText, this);
                    ko.applyBindings(removedNotificationDialog, $("#divCourseRemovedConfirmation").get(0));
                }
                return removedNotificationDialog;
            },

            GetRetirementNotification: function (notificationMessage, infoMsg, btnPrimaryText, btnTertiaryText, replacementCourseData) {
                if (!retirementNotification) {
                    retirementNotification = new Overlay_RetirementNotificationViewModel(notificationMessage, infoMsg, btnPrimaryText, btnTertiaryText, replacementCourseData);
                    ko.applyBindings(retirementNotification, $("#divCourseRetirement").get(0));
                }
                return retirementNotification;
            },

            GetDeleteConfirmation: function (errorArray, headingText, btnText, btnCancelText) {
                confirmDialog = new Overlay_ErrorViewModel(errorArray, headingText, btnText, btnCancelText);
                var divLearnigPlanDeleteConfirm = $("#divLearnigPlanDeleteConfirm").get(0);
                ko.cleanNode(divLearnigPlanDeleteConfirm);
                ko.applyBindings(confirmDialog, divLearnigPlanDeleteConfirm);
                return confirmDialog;
            },

            GetErrors: function (errorArray, headingText, btnText, btnCancelText) {
                if (!errorDialog) {
                    errorDialog = new Overlay_ErrorViewModel(errorArray, headingText, btnText, btnCancelText);
                    var divErrorMessage = $("#divErrorMessage").get(0);
                    ko.cleanNode(divErrorMessage);
                    ko.applyBindings(errorDialog, divErrorMessage);
                } else {
                    if (headingText) {
                        errorDialog.headingText(headingText);
                    }
                    else {
                        errorDialog.headingText(ResourceStrings.errorHeadingText);
                    }

                    if (btnText) {
                        errorDialog.btnText(btnText);
                    }
                    else {
                        errorDialog.btnText(ResourceStrings.errorButtonOkText);
                    }
                    if (btnCancelText) {
                        errorDialog.btnCancelText(btnCancelText);
                    }
                    else {
                        errorDialog.btnCancelText('');
                    }

                    errorDialog.errorArray(errorArray);
                }
                return errorDialog;
            },

            GetAuthError: function (errorArray, headingText, btnText, btnCancelText) {
                if (!errorAuthDialog) {
                    errorAuthDialog = new Overlay_ErrorViewModel(errorArray, headingText, btnText, btnCancelText);
                    ko.applyBindings(errorAuthDialog, $("#divAuthErrorMessage").get(0));
                } else {
                    if (headingText) {
                        errorAuthDialog.headingText(headingText);
                    }
                    else {
                        errorAuthDialog.headingText(ResourceStrings.errorHeadingText);
                    }

                    if (btnText) {
                        errorAuthDialog.btnText(btnText);
                    }
                    else {
                        errorAuthDialog.btnText(ResourceStrings.errorButtonOkText);
                    }

                    if (btnCancelText) {
                        errorAuthDialog.btnCancelText(btnCancelText);
                    }
                    else {
                        errorAuthDialog.btnCancelText('');
                    }

                    errorAuthDialog.errorArray(errorArray);
                }
                return errorAuthDialog;
            },

            registerSearchCallbacks: function (showMyCourses, showCourse) {
                this.showMyCourses = showMyCourses;
                this.showCourse = showCourse;
            },

            GetResigningOverlay: function (url) {
                if (!resignDialog) {
                    resignDialog = new Overlay_ResigningViewModel(url);
                    ko.applyBindings(resignDialog, $("#divReauthenticateDlg").get(0));
                }
                return resignDialog;
            },

            Overlay_ResigningViewModel: function (url) {
                var self = this;
                self.isShown = ko.observable(false);
                self.linkText = ko.observable(url);
                self.open = function (callBackToSDK) {
                    self.isShown(true);
                    $('#reauthenticateLink:not(.bound)').addClass('bound').bind('click', function () {
                        self.isShown(false);
                        var reauthWindow = window.open(self.linkText(), '_blank');

                        var loginInterval = setInterval(function () { // Wait until user has logged in
                            try {
                                var l = reauthWindow.location.host;
                            }
                            catch (e) { // If attempting to access the location.host of the new window then the user has navigated to the login
                                // provider page so retry the operation
                                self.isShown(false);
                                window.clearInterval(loginInterval);
                                // Retry operation
                                callBackToSDK();
                            }
                        }, 20000);
                    });
                };
                self.close = function () {
                    self.isShown(false);
                };
            },

            Overlay_NotificationViewModel: function (notificationMessage, btnText, overlay) {
                var self = this;
                self.isShown = ko.observable(false);
                self.notification = ko.observable(notificationMessage);
                self.message = ko.observable();
                self.btnText = btnText;
                self.skip = function () {
                    self.isShown(false);
                };

                self.viewCourse = function () {
                    self.isShown(false);
                    if (overlay.showCourse) {
                        overlay.showCourse();
                    }
                };

                self.viewMyCourses = function () {
                    self.isShown(false);
                    if (overlay.showMyCourses) {
                        overlay.showMyCourses();
                    }
                    return true;
                };

                self.open = function (message) {
                    self.message(message);
                    self.isShown(true);
                };
            },

            Overlay_RetirementNotificationViewModel: function (notificationMessage, infoMsg, btnPrimaryText, btnTertiaryText, replacementCourseData) {
                var self = this;
                self.isShown = ko.observable(false);
                self.notification = ko.observable(notificationMessage);
                self.infoMsg = infoMsg;
                self.btnPrimaryText = btnPrimaryText;
                self.btnTertiaryText = btnTertiaryText;
                self.replacementCourse = ko.observable(replacementCourseData);

                self.seeAllCourses = function () {
                    trackCourseRetirementButton('See All Courses', '', Configurations.playerType, Configurations.coursePlayerHostUrl);
                    location.href = Configurations.searchResultsUrlTemplate.replace("{Host}", window.location.host);
                };

                self.viewHomePage = function () {
                    trackCourseRetirementButton('View Home Page', '', Configurations.playerType, Configurations.coursePlayerHostUrl);
                    location.href = window.location.protocol + "//" + window.location.host;
                };

                self.viewNewCourse = function () {
                    var self = this;
                    trackCourseRetirementButton('View New Course', self.replacementCourse().name, Configurations.playerType, Configurations.coursePlayerHostUrl);
                    location.href = Configurations.coursePlayerUrlTemplate
                        .replace("{Host}", window.location.host)
                        .replace("{LanguageCode}", self.replacementCourse().languageCode)
                        .replace("{FriendlyName}", getCoursePlayerFriendlyName(self.replacementCourse().id, self.replacementCourse().name));
                };

                self.open = function (message) {
                    self.isShown(true);
                };
            },

            GetCustomMessage: function () {
                if (!customMessage) {
                    customMessage = new Overlay_CustomMessageViewModel();
                    if ($("#divCustomMessage").get(0)) {
                        $("#divCustomMessage").remove();
                    }
                    $('<div id="divCustomMessage" class="overlay-loading-wrapper" data-bind="notificationPopupBinding: isShown" style="z-index:400;display:none;">\
                <div class="overlay-container" data-bind="template: { name: templateId() }"></div>\
            </div>').appendTo($('body'));
                    ko.applyBindings(customMessage, $("#divCustomMessage").get(0));

                    // Add overlay
                    if ($("#overlay").length === 0) {
                        $('<div id="overlay" style="display: block;"></div>').appendTo($('body'));
                    }
                }
                return customMessage;
            }

        };

        return obj;
    })();


    microsoft.learning.mlx.Overlay_BusyloaderIndicatorViewModel = (function () {
        var obj = function () {

            var self = this;
            self.isShown = ko.observable(false);
            self.message = ko.observable('');

        };

        obj.prototype = {

            open: function (message, promise) {
                this.message(message);
                this.isShown(true);

                if (promise && promise.then) {
                    promise.then(this.close, this.close);
                }
            },

            close: function () {
                this.isShown(false);
            }
        };

        return obj;
    })();


    microsoft.learning.mlx.Overlay_WelcomeMessageViewModel = (function () {
        var obj = function () {

            var self = this;
            self.isShown = ko.observable(false);
            self.title = ko.observable('');

        };

        obj.prototype = {

            ok: function () {
                this.isShown(false);
            },

            open: function (title) {
                this.title(title);
                this.isShown(true);
            }
        };

        return obj;
    })();



    microsoft.learning.mlx.Overlay_CourseAddedViewModel = (function () {
        var obj = function () {

            var self = this;
            self.isShown = ko.observable(false);
            self.message = ko.observable('');

        };

        obj.prototype = {

            skip: function () {
                this.isShown(false);
            },
            viewCourse: function () {
                this.isShown(false);
            },

            open: function (message) {
                this.message(message);
                this.isShown(true);
            }
        };

        return obj;
    })();



    microsoft.learning.mlx.Overlay_CustomMessageViewModel = (function () {
        var obj = function () {

            var self = this;
            var deferred = undefined;

            self.isShown = ko.observable(false);
            self.templateId = ko.observable('');

        };

        obj.prototype = {

            open: function (target) {
                if (target instanceof jQuery) {
                    var templateId = target.attr('id');
                }
                else if (microsoft.learning.mlx.utility.isElement(target)) {
                    var templateId = target.id;
                }
                else {
                    deleteOldTemplates();
                    var templateId = 'customMessageTemplate' + new Date().getTime();
                    $('<script type="text/html" id="' + templateId + '" generated="true">' + target + '</script>').appendTo($('head'));
                };

                this.templateId(templateId);
                $('#overlay').css('z-index', 399);
                this.isShown(true);

                deferred = $.Deferred();
                return deferred.promise();
            },


            close: function () {
                this.isShown(false);
                $('#overlay').css('z-index', '');
                this.templateId('');

                // knockout parameters can't be serialized to json
                var args = microsoft.learning.mlx.utility.convertArgumentsToArray(arguments);
                args.pop(); // remove from array events argument
                args.pop(); // remove from array sender model argument

                deferred.resolve(args);
            },

            deleteOldTemplates: function () {
                var $template = $('script[id^="customMessageTemplate"][generated="true"]')
                $template.remove();
            }

        };

        return obj;
    })();


    microsoft.learning.mlx.Overlay_ErrorViewModel = (function () {
        var obj = function () {

            var self = this
            deferred = $.Deferred();
            self.isShown = ko.observable(false);
            self.errorArray = ko.observable(errorArray);
            self.headingText = ko.observable('');
            self.btnText = ko.observable('');
            self.btnCancelText = ko.observable('');

            if (headingText) {
                self.headingText(headingText);
            }
            else {
                self.headingText(ResourceStrings.errorHeadingText);
            }

            if (btnText) {
                self.btnText(btnText);
            }
            else {
                self.btnText(ResourceStrings.errorButtonOkText);
            }

            // Should be shown only for unauthorized errors.
            if (btnCancelText) {
                self.btnCancelText(btnCancelText);
            }


        };

        obj.prototype = {

            open: function (message) {
                self.isShown(true);
                return deferred.promise();
            },


            ok: function () {
                if (!window.location.origin)
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

                window.location = window.location.origin;
            },

            cancel: function () {
                if (!window.location.origin)
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

                window.location = window.location.origin;
            }

        };

        return obj;
    })();

});






