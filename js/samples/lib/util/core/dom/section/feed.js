define(function(require, exports, module) {
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var string = require('../../../../../../lib/util/core/string.js');
    var action = require('../../../../../../lib/util/core/dom/action.js');
    var inputx = require('../../../../../../lib/util/core/dom/input.js');

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
        inputx.reg(textarea, function(val, lastInput, rangeData) {
            inputx.autoHeight(textarea); // 自动高度
            var offset = inputx.position.offset(textarea);
            if(lastInput == '@') {
                console.log(rangeData.start + '位置检测输入@，坐标 left:' + offset.left + ', top:' + offset.top);
            } else if(lastInput == '#') {
                console.log(rangeData.start + '位置检测输入#，坐标 left:' + offset.left + ', top:' + offset.top);
            } else {
                console.log('当前输入位置:' + rangeData.start + '，字符：' + lastInput);
            }
            if(string.blength($.trim(textarea.val()) || '', true)) {
                btn.removeClass('m-button-dis');
            } else {
                btn.addClass('m-button-dis');
            }
            console.log('字数统计（半角算半个字长）：' + string.blength(textarea.val() || '', true));
            console.log('-----------------------------------');
        });
    };
});