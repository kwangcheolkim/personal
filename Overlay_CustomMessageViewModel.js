Overlay_CustomMessageViewModel: function() {
    var self = this;
    var deferred = undefined;

    self.isShown = ko.observable(false);
    self.templateId = ko.observable('');

    // Open dialog window
    // Argument target can be jQuery object or dom element or html string
    self.open = function (target) {
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
        }

        self.templateId(templateId);
        $('#overlay').css('z-index', 399);
        self.isShown(true);

        deferred = $.Deferred();
        return deferred.promise();
    };

    self.close = function () {
        self.isShown(false);
        $('#overlay').css('z-index', '');
        self.templateId('');

        // knockout parameters can't be serialized to json
        var args = microsoft.learning.mlx.utility.convertArgumentsToArray(arguments);
        args.pop(); // remove from array events argument
        args.pop(); // remove from array sender model argument

        deferred.resolve(args);
    };

    function deleteOldTemplates() {
        var $template = $('script[id^="customMessageTemplate"][generated="true"]')
        $template.remove();
    }
};
