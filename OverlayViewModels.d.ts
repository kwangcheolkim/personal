declare namespace microsoft.learning.mlx {

    export class OverlayViewModels {

        constructor();

        busyIndicator: any;
        busyIndicatorMessage: any;
        welcomeMessage: any;
        courseAddMessage: any;
        coursePlayerOverlayModel: any;
        coursePlayerNotificationOverlayModel: any;
        notificationDialog: any;
        removedNotificationDialog: any;
        busyIndicatorMessageSupport: any;
        resignDialog: any;
        customMessage: any;
        errorDialog: any;
        confirmDialog: any;
        errorAuthDialog: any;
        retirementNotification: any;

        Overlay_BusyloaderIndicatorViewModel();

        Overlay_WelcomeMessageViewModel();
        Overlay_CourseAddedViewModel();
        GetBusyIndicator();
        GetBusyIndicatorMessage();

        GetBusyIndicatorMessageSupport();
        GetWelcomeMessage();
        GetCourseAddOverlay();
        GetCoursePlayerOverlay();
        GetCoursePlayerNotificationOverlay(messageHeading, btnText);
        GetNotification(notificationMessage, btnText);
        GetRemovedNotification(notificationMessage, btnText);
        GetRetirementNotification(notificationMessage, infoMsg, btnPrimaryText, btnTertiaryText, replacementCourseData);
        GetDeleteConfirmation(errorArray, headingText, btnText, btnCancelText);
        GetErrors(errorArray, headingText, btnText, btnCancelText);
        GetAuthError(errorArray, headingText, btnText, btnCancelText);
        registerSearchCallbacks(showMyCourses, showCourse);
        GetResigningOverlay(url);
    }

}