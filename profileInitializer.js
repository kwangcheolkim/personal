/*
Create profile initializer view model
*/
$(function () {
    ProfileInitializerViewModel = (function () {
        var cs = function () {
            var self = this;
            self.userProfile = ko.observableArray();
            self.courses = ko.observableArray();
            self.jobFunctions = ko.observableArray();
            self.languagePreference = ko.observableArray();
            self.firstName = ko.observable();
            self.lastName = ko.observable();
            self.profileUrl = ko.observable();
            self.fullName = ko.computed(function () {
                return this.firstName() + " " + this.lastName();
            }, this);

            self.initializeDeferred = undefined;

        };

        cs.prototype = {

            /*
              Fires the first time User enter the page.
            */
            initialize: function () {
                var self = this;
                self.initializeDeferred = $.Deferred();

                if (Configurations.isMigrationCompleted) {
                    if (MLX.context.currentUser.isAuthenticated) {
                        if (MLX.context.currentUser.currentUserId == 0) {
                            switchOverlay(true);
                            registerProfile();
                        } else {
                            self.getAndSaveMasterUser();
                            if (Configurations.isMigrationCompleted && TechRewardConfig.AllowRegisterTechRewards) {
                                params = {
                                    userId: MLX.context.currentUser.currentUserId,
                                    countryCode: MLX.context.currentUser.CountryCode,
                                    userName: MLX.context.currentUser.firstName + " " + MLX.context.currentUser.lastName,
                                    emailAddress: MLX.context.currentUser.emailAddress
                                };
                                var baseURL = $('#hfBaseURL').attr("value");
                                var url = baseURL + "Handlers/MlxWebMethodsHandler.aspx/RegisterUserToTechRewards";
                                var promise = $.ajax({
                                    type: 'POST',
                                    url: url,
                                    data: JSON.stringify(params),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    success: function (msg) {
                                    },
                                    error: function (msg) {
                                    }
                                });
                            }
                            self.getMasterUser();

                            if ($("div[id$='rightMenuTemplate']").length > 0)
                            {
                                ko.applyBindings(self, $("div[id$='rightMenuTemplate']")[0]);
                            }

                            self.initializeDeferred.resolve()
                        }
                    } else {
                        $('#rightMenuLoggedIn').hide();
                        $('#rightMenuNotLoggedIn').show();
                        self.initializeDeferred.resolve();
                    }

                    PageLoadTrackingOptions.SignedInState = MLX.context.currentUser.isAuthenticated ? "signed in" : "signed out";

                    if (TrackPageLoad && PageLoadTrackingOptions.SiteSection != null && PageLoadTrackingOptions.SiteSection != "") {
                        $(document).ready(function () {
                            executeTrackPageLoad(PageLoadTrackingOptions);
                        });
                    }
                }
                else {
                    if (Configurations.isMvaUserAuthenticated) {
                        if (Configurations.UserId > 0 && !Configurations.isMigratedUser) {
                            self.initializeDeferred.resolve();
                        } else {
                            if (Configurations.isMigrationStarted && (Configurations.registerInMLX || Configurations.isMigratedUser)) {
                                var homeRealm = "uri:MicrosoftAccount";
                                if (!MLX.context.currentUser.isAuthenticated) {
                                    var _this = this;
                                    MLX.signIn(undefined, homeRealm, window.location, true, function () { _this.masterCallback(); _this.initializeDeferred.resolve(); });

                                } else {
                                    self.masterCallback();
                                    self.initializeDeferred.resolve();
                                }
                            }
                            else {
                                self.initializeDeferred.resolve();
                            }
                        }
                    } else {
                        self.initializeDeferred.resolve();
                    }
                }
                return self.initializeDeferred.promise();
            },

            /*
            Get user profile data from mlx 
            */
            getMasterUser: function () {
                var self = this;
                self.firstName(MLX.context.currentUser.firstName);
                self.lastName(MLX.context.currentUser.lastName);
                    self.profileUrl(getURL('profile'));
                    $("#lnkDashboard").attr('href', getURL('dashboard'));
                    if (MLX.context.currentUser.currentUserId != 0) {
                        $('#rightMenuLoggedIn').show();
                        $('#rightMenuNotLoggedIn').hide();
                        if ($("div[id$='HiddenMPSBanner']").text() != "") {
                            $(".list-container.MPSBanner").html($("div[id$='HiddenMPSBanner']")[0].innerText);
                            $("div[id$='HiddenMPSBanner']").text("");
                        }
                    } 
            },

            getAndSaveMasterUser: function () {
                var self = this;
                
                self.ProfileType = { MvaRegistrationProfile: 4194302 };
                userProfileModel = new microsoft.learning.mlx.UserProfileModel();
                var promise = userProfileModel.getMasterUser(self.ProfileType.MvaRegistrationProfile);
                promise.done(function (user) {
                    if ((MLX.context.currentUser.firstName != null && MLX.context.currentUser.firstName != "") && (MLX.context.currentUser.lastName != null && MLX.context.currentUser.lastName != "") && (MLX.context.currentUser.CountryCode != null && MLX.context.currentUser.CountryCode != "")) {
                        if (MLX.context.currentUser.firstName != user.BasicProfile.FirstName || MLX.context.currentUser.lastName != user.BasicProfile.LastName || MLX.context.currentUser.CountryCode != user.BasicProfile.CountryCode) {
                            user.BasicProfile.FirstName = $.trim(MLX.context.currentUser.firstName);
                            user.BasicProfile.LastName = $.trim(MLX.context.currentUser.lastName);

                            user.BasicProfile.CountryCode = MLX.context.currentUser.CountryCode;
                            var promise = userProfileModel.saveMasterUser(user);

                            promise.done(function (data) {

                            }).fail(function (data) {

                            });
                        }
                    }
                });
            },

            masterCallback: function () {
                var self = this;
                if (MLX.context.currentUser.currentUserId == 0) {
                    switchOverlay(true);
                    registerProfile();
        
                }
                if (Configurations.UserId > 0 && Configurations.isMigratedUser) {
                    self.getAndSaveMasterUser();
                }
            }
        };

        return cs;
    })();

});


var getURL = function (page) {
    if (!window.location.origin)
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    var urlTemplate = '';
    switch (page) {
        case 'register': 
            urlTemplate = Configurations.RegisterUrlTemplate;
            break;
        case 'profile':
            urlTemplate = Configurations.MyProfileUrlTemplate;
            break;
        case 'dashboard':
            urlTemplate = Configurations.DashboardUrlTemplate;
            break;
    }

    return urlTemplate.replace('{Host}', window.location.host);
}

var setFooterComboLanguages = function (selectedLanguage) {
    var self = this;
    closePopups(true, true);
    switchOverlay(true);
    if (MLX.context.currentUser.isAuthenticated) {
        var UserMasterProfile = new Object();
        self.ProfileType = { MvaRegistrationProfile: 4194302 };
        userProfileModel = new microsoft.learning.mlx.UserProfileModel();
        var promise = self.userProfileModel.getMasterUser(self.ProfileType.MvaRegistrationProfile);
        promise.done(function (user) {

            UserMasterProfile.BasicProfile = new Object();
            UserMasterProfile.BasicProfile.FirstName = user.BasicProfile.FirstName;
            UserMasterProfile.BasicProfile.LastName = user.BasicProfile.LastName;
            UserMasterProfile.BasicProfile.JobFunctionId = user.BasicProfile.JobFunctionId;
            UserMasterProfile.BasicProfile.CountryCode = user.BasicProfile.CountryCode;
            UserMasterProfile.BasicProfile.PreferredLanguage = selectedLanguage;
            UserMasterProfile.BasicProfile.ContactEmailAddress = user.BasicProfile.ContactEmailAddress;
            UserMasterProfile.BasicProfile.AcceptedTermsOfUse = 1;
            UserMasterProfile.BasicProfile.CompanyName = user.BasicProfile.CompanyName;
            UserMasterProfile.PrivacyPreferences = new Object();
            UserMasterProfile.PrivacyPreferences.MSMarketingEmailOptin = user.PrivacyPreferences.MSMarketingEmailOptin;
            UserMasterProfile.PrivacyPreferences.MSPartnersMarketingEmailOptin = user.PrivacyPreferences.MSPartnersMarketingEmailOptin;

            userProfileModel = new microsoft.learning.mlx.UserProfileModel();
            var promise = self.userProfileModel.saveMasterUser(UserMasterProfile);
            promise.done(function (data) {
                if (!Configurations.isMigrationCompleted) {
                    //push in web method 
                    if (Configurations.saveUserInformationInDb) {
                        var userInfo = {
                            "Id": MLX.context.currentUser.currentUserId,
                            "CountryCode": MLX.context.currentUser.CountryCode,
                            "LanguageCode": selectedLanguage,
                        };

                        var param = {
                            mlxUser: mlxUser = userInfo,
                            IsFooterLanguage: true
                        };
                        userProfileAJAXPost("Handlers/MlxWebMethodsHandler.aspx/SaveUserInformation", param);
                    }
                } else {

                    var url = window.location.href;
                    url = (url.indexOf("#!") > -1) ? url.replace("#!", "?").toString() : url;
                    if (url.indexOf("&lng=") > -1 || url.indexOf("?lng=") > -1) {
                        var lngIndex = (url.indexOf("&lng=") > -1) ? url.indexOf("&lng=") : url.indexOf("?lng=");
                        url = url.substring(0, lngIndex);
                    }
                    if (url.indexOf("?") > -1) {
                        window.location.href = url + "&lng=" + UserMasterProfile.BasicProfile.PreferredLanguage;
                    } else {
                        window.location.href = url + "?lng=" + UserMasterProfile.BasicProfile.PreferredLanguage;
                    }

                }
            });
        });
        return false;
    }
    else {
        return true;
    }
}

/*
Display or hide overlay 
*/
var switchOverlay = function (visible) {
    var self = this;
    if (visible) {
        $("[id$='overlay-container']").show();
    } else {
        $("[id$='overlay-container']").hide();
    }
}

var mlxSignOut = function () {
    $.removeCookie('RegAnonymousApiInProgress', { path: '/' });
    $.cookie('RegisteredMember', '', { expires: 365, path: '/' });
    var isMvaSignOut = true;
    if (Configurations.isMigrationCompleted && MLX.context.currentUser.isAuthenticated) {
        MLX.signOut();
        isMvaSignOut = false;
            }
    return isMvaSignOut;
}

/*
Ajax call to webmethod
*/
var userProfileAJAXPost = function () {
    var baseURL = $('#hfBaseURL').attr("value");
    var url = baseURL + userProfileAJAXPost.arguments[0];
    var params = userProfileAJAXPost.arguments[1];


    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (!window.location.origin)
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            if(msg.d=="success"){
                window.location.reload();
            } else if (msg.d == "editsuccess") {
              
            } else {
                window.location.href = msg.d;
            }
        },
        error: function (msg) {
            window.location.reload();
        }
    });
}

var mlxSignIn = function () {
    if (!MLX.context.currentUser.isAuthenticated) {
        var homeRealm = "uri:MicrosoftAccount";
        MLX.signIn(undefined, homeRealm, window.location);
    }
}

var switchRegistrationOverlay = function (visible) {
    var self = this;
    if (visible) {
        $("#registration").show();
    } else {
        $("#registration").hide();
    }
}

/* ---------- Merge Anonymous course activities with migrated profiled user -------------------*/
function deleteFreeActions() {
    document.cookie = 'FreeActions=;path=/;domain=' + window.location.host + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getAnonGUID() {
    var userGUID = getValueFromCookie('FreeActions');
    if (userGUID.trim().length > 0) {
        userGUID = userGUID.substr(0, userGUID.indexOf("|"));
        return userGUID.substr("guid=".length);
    }
    return "";
}

function mergeAnonymousActivitiesMigratedUser(mergeCallBack) {

    if (MLX.context.currentUser.currentUserId > 0) {
        var userGUID = getValueFromCookie('FreeActions');
        var freeActionsCount = 0;
        var url = "https://{MvaApiHost}/api/{GUID}/{userID}/mergeAnonymousActivities";

        userGUID = userGUID.substr(0, userGUID.indexOf("|"));
        userGUID = userGUID.substr("guid=".length);
        
        if (userGUID != "") {
            freeActionsCount = getArrayValuesFromCookie('FreeActions').count;
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
}

function SaveAnonymousUserDetailsInTableStore() {
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
}