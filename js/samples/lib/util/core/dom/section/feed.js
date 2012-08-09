define(function(require, exports, module) {
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var string = require('../../../../../../lib/util/core/string.js');
    var action = require('../../../../../../lib/util/core/dom/action.js');
    var helper = require('./helper.js');

    return function(params) {
        var publishBox = $('.publish').eq(0);
        var textarea = publishBox.find('textarea').eq(0);
        var btn = publishBox.find('.m-button').eq(0);

        action.listen({
            openPublishBox: function(e) {
                publishBox.addClass('publish-active');
                textarea.focus();
            }
        });

        textarea.blur(function() {
            if(this.value.length == 0) {
                publishBox.removeClass('publish-active');
            }
        });
        helper.textareaListen(textarea, btn);
    };
});