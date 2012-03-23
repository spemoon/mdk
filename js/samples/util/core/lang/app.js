define(function(require, exports, module) {
    var $ = require('../../../../lib/jquery/1.7.1/sea_jquery.js');
    var lang = require('../../../../lib/util/core/lang.js');

    $(function() {
		// 实例代码
        var box = $('#result');
        var btn1 = $('#btn1');
        var btn2 = $('#btn2');
        var flag = true;
        var helper = {
            init:function() {
                btn1.removeAttr('disabled');
                btn2.attr('disabled', 'disabled');
            },
            enable:function() {
                flag = false;
                helper.init();
            },
            disable:function() {
                flag = true;
                btn1.attr('disabled', 'disabled');
                btn2.removeAttr('disabled');
            }
        };

        helper.init();
        var timer;
        btn1.click(function() {
            var i = 1;
            timer = lang.timer({
                fn:function() {
                    box[0].innerHTML += i + ', ';
                },
                rule:function() {
                    return i <= 15;
                },
                step:function() {
                    return (i++) * 128;
                },
                start:helper.disable,
                end:helper.enable
            });
        });

        btn2.click(function() {
            if(timer) {
                timer.stop();
            }
        });

        // 语法高亮
        seajs.use('../../../../lib/external/syntaxHighlighter/shBrushJScript.js', function(highlighter) {
            highlighter.highlight();
        });
    });
});
