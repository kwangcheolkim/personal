
Overlay_ErrorViewModel: function(errorArray, headingText, btnText, btnCancelText) {
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

    self.open = function () {
        self.isShown(true);
        return deferred.promise();
    };

    self.ok = function () {
        if (!window.location.origin)
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

        window.location = window.location.origin;
    };

    self.cancel = function () {
        if (!window.location.origin)
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

        window.location = window.location.origin;
    };
}
