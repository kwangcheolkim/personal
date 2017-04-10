var registerProfileModel;
/*
Create profile initializer view model
*/
$(function () {
    RegisterProfileViewModel = (function () {
        var cs = function (registerProfileModel) {
            var self = this;
            self.registerProfileModel = registerProfileModel;
            self.jobFunctions = ko.observableArray();
            self.languagePreference = ko.observableArray();
            self.countries=ko.observableArray();
            self.SelectJobFunctionId = ko.observable();
            self.SelectLanguageCode = ko.observableArray();
            self.SelectCountryCode = ko.observableArray();
            self.courses = ko.observableArray();
            self.firstName = ko.observable();
            self.lastName = ko.observable();
            self.profileUrl = ko.observable();
            self.fullName = ko.observable();
            self.countryId = ko.observable();
            self.emailAddress = ko.observable();
            self.hearFromMicrosoft = ko.observable(false);
            self.hearFromMicrosoftPartners = ko.observable(false);
            self.companyName = ko.observable('');
            self.termsOfUse = ko.observable('');
            self.privacyStatement = ko.observable('');
            self.initializeDeferred = undefined;

        };

        cs.prototype = {

            /*
              Fires the first time User enter the page.
            */
            initialize: function () {
                var self = this;
                self.initializeDeferred = $.Deferred();

                $(document).ready(function () {
                    var lnkRegister = null;
                    if (!lnkRegister) {
                        lnkRegister = $('#lnkConfirmRegister');
                    }
                    $("[id$='chkTouPrivacyStatement']").on('click', function () {
                        
                        if ($("[id$='chkTouPrivacyStatement']:checked").length != 0) {
                            lnkRegister.prop('disabled', false)
                            .addClass('enable-button')
                            .removeClass('remove-outline')
                            .removeClass('registration-disabled');
                        } else {
                            lnkRegister.prop('disabled', true)
                            .removeClass('enable-button')
                            .addClass('registration-disabled')
                            .addClass('remove-outline');
                        }
                    });
                    lnkRegister.on('click', function () {
                        if (!lnkRegister.hasClass('registration-disabled')) {
                            var valid = validateAnyHTMLtag(notificationMsg,"");
                            if (valid) {
                                switchRegConfirmOverlay(true);
                                self.registerUser();
                            }
                        }
                    });

                    trackRegistrationOpen();
                   
                });

                self.initializeDeferred.resolve();
                return self.initializeDeferred.promise();
            },

            /*
            Get jobFunctions from mlx 
            */
            getJobFunctions: function () {
                var self = this;
                self.jobFunctions([]);
                var promise = registerProfileModel.getAllJobFunctions();
                promise.done(function (jobfunctions) {
                    $.each(jobfunctions, function (i, jobfunction) {
                        if (jobfunction.ParentJobFunctionId == null) {
                            self.jobFunctions.push(jobfunction);
                        }
                        else {
                            self.jobFunctions.remove(function (jfunction) {
                                return jfunction.JobFunctionId == jobfunction.ParentJobFunctionId;
                            });
                            self.jobFunctions.push(jobfunction);
                        }
                    });
                    self.setUserDetails();
                });
            },

            /*
            Get LanguagePreference from mlx 
            */
            getLanguagePreference: function () {
                var self = this;
                var promise = registerProfileModel.getAllLanguages();
                promise.done(function (mlxLanguages) {
                    var mvaLanguages =
                        $.grep(mlxLanguages, function (e, i) {
                            return $.inArray(e.LCID, RegisterPageConfig.AvailableUILCIDs) !== -1;
                        });
                    self.languagePreference([]);
                    self.languagePreference(mvaLanguages);
                    self.SelectLanguageCode(RegisterPageConfig.DefaultLanguageCode);

                });
            },


            getIdByCode: function (code, type) {
                var self = this;
                if (type == "lang") {
                    var languages = self.languagePreference();
                    if (languages.length > 0) {
                        return languages.filter(function (language) {
                            return language.LanguageCode == code;
                        })[0].LanguageId
                    } else {
                        return code;
                    }
                }
                return code;
            },
            
            /*
            Get user profile data from mlx 
            */
            setUserDetails: function () {
                switchOverlay(false);
                var self = this;
                //set register page changes
                self.firstName(MLX.context.currentUser.firstName);
                self.lastName(MLX.context.currentUser.lastName);
                self.emailAddress(MLX.context.currentUser.signInEmailAddress);
                $(".registration-title.headline").html(function (i, val) {
                    return val.replace('{0}', MLX.context.currentUser.firstName);
                });
               
                self.termsOfUse(RegisterPageConfig.HlurlTermsOfUse);
                self.privacyStatement(RegisterPageConfig.HlurlPrivacyStatement);
                                
                switchRegistrationOverlay(true);
            },

            registerUser : function () {
                var self = this;

                if ((Configurations.isMigrationStarted && Configurations.registerInMLX) || Configurations.isMigrationCompleted) {

                    trackRegistrationDone("ddlJobFunction", RegisterPageConfig.countryName, "ddlLanguage", "chkHearFromMicrosoft", RegisterPageConfig.prePopulatedUserCountry, RegisterPageConfig.prePopulatedUserLanguage, RegisterPageConfig.prePopulatedAcceptCommunication, "txtCompanyOrgName");

                    self.hearFromMicrosoft($("[id$='chkHearFromMicrosoft']:checked").length == 1 ? true : false);
                    self.companyName($('input[id$="txtCompanyOrgName"]').val());
                    self.SelectJobFunctionId($("[id$='ddlJobFunction']").val());
                    var UserMasterProfile = new Object();

                    UserMasterProfile.BasicProfile = new Object();
                    UserMasterProfile.BasicProfile.FirstName = $.trim(self.firstName());
                    UserMasterProfile.BasicProfile.LastName = $.trim(self.lastName());
                    UserMasterProfile.BasicProfile.JobFunctionId = self.SelectJobFunctionId();
                    UserMasterProfile.BasicProfile.CountryCode = (MLX.context.currentUser.CountryCode != "") ? MLX.context.currentUser.CountryCode : RegisterPageConfig.DefaultCountryCode;
                    UserMasterProfile.BasicProfile.PreferredLanguage = self.SelectLanguageCode();
                    UserMasterProfile.BasicProfile.ContactEmailAddress = $.trim(self.emailAddress());
                    UserMasterProfile.BasicProfile.AcceptedTermsOfUse = 1;
                    UserMasterProfile.BasicProfile.CompanyName = $.trim(self.companyName());
                    UserMasterProfile.PrivacyPreferences = new Object();
                    UserMasterProfile.PrivacyPreferences.MSMarketingEmailOptin = self.hearFromMicrosoft();
                    UserMasterProfile.PrivacyPreferences.MSPartnersMarketingEmailOptin = false;

                    registerProfileModel = new microsoft.learning.mlx.UserProfileModel();
                    var promise = registerProfileModel.registerMasterUser(UserMasterProfile);

                    promise.done(function (data) {
                       
                        //push in web method 
                        if (!Configurations.isMigrationCompleted){

                            if (Configurations.saveUserInformationInDb) {

                                var userInfo = {
                                    "Id": MLX.context.currentUser.currentUserId,
                                    "CountryCode": MLX.context.currentUser.CountryCode,
                                    "LanguageCode": self.SelectLanguageCode(),
                                    "IsActive": (MLX.context.currentUser.isActive == 1) ? true : false,
                                    "RPS_Email": MLX.context.currentUser.signInEmailAddress,
                                    "LastName": MLX.context.currentUser.lastName,
                                    "Name": MLX.context.currentUser.firstName,
                                    "JobFunctionId": self.SelectJobFunctionId(),
                                    "HearFromMicrosoft": self.hearFromMicrosoft(),
                                };

                                var param = {
                                    mlxUser: mlxUser = userInfo,
                                    IsFooterLanguage: false
                                };
                                userProfileAJAXPost("Handlers/MlxWebMethodsHandler.aspx/SaveUserInformation", param);
                            }
                            else {
                                window.location.reload();
                            }
                        } else {
                            var baseURL = $('#hfBaseURL').attr("value");
                            var url = baseURL + "Handlers/WebMethodsHandler.aspx/SetAllowRegisterTechRewardSession";
                            $.ajax({
                                type: 'POST',
                                url: url,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (msg) {
                                    if (window.location.href.indexOf("?") > -1) {
                                        window.location.href += "&lng=" + self.SelectLanguageCode();
                                    } else {
                                        window.location.href += "?lng=" + self.SelectLanguageCode();
                                    }
                                },
                                error: function (msg) {
                                }
                            });
                           
                        }

                    }).fail(function (data) {
                    });
                }
            },

        };

        return cs;
    })();

});

var switchRegConfirmOverlay = function (visible) {
    var self = this;
    if (visible) {
        $("#registration-loading").show();
    } else {
        $("#registration-loading").hide();
    }
}


var registerProfile = (function () {
    var self = this;

    self.registerProfileCallback = function () {
        SaveAnonymousUserDetailsInTableStore();
        //If user logged in from profile page, need to check for free actions and merge with Profiled user
        mergeAnonymousActivitiesMigratedUser();        

        registerProfileModel = new microsoft.learning.mlx.UserProfileModel();
        if ((Configurations.isMigrationStarted && Configurations.registerInMLX) || Configurations.isMigrationCompleted) {
            var registerProfileViewModel = new RegisterProfileViewModel(registerProfileModel);
            registerProfileViewModel.initialize().done(function () {
               ko.applyBindings(registerProfileViewModel, $("div[id$='divRegistrationPopUpContainer']")[0]);
               
            });

            registerProfileViewModel.getLanguagePreference();
            registerProfileViewModel.getJobFunctions();
            
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

        if (!MLX.context.currentUser.isAuthenticated) {
            var homeRealm = "uri:MicrosoftAccount";
            MLX.signIn(undefined, homeRealm, window.location, true, self.registerProfileCallback);
        }else{
            self.registerProfileCallback();
        }
    });
   
})

//if (Configurations.isMigrationCompleted || Configurations.isMigrationStarted ) {
//    MLX.loadBundles({ bundles: ["coreapi", "webtrends", "learnerapi"], version: "1.0.0.0", debug: !1, loadDefaultBundles: !1, bundleLoadedCallback: registerProfile });
//}

