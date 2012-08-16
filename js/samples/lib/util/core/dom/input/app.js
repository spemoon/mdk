define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var inputx = require('../../../../../../lib/util/core/dom/input.js');
    var string = require('../../../../../../lib/util/core/string.js');
    var regexp = require('../../../../../../lib/util/core/regexp.js');

    $(function() {
        /**--------------------------------------------
         * 实例1： 字数统计的几种情况
         * --------------------------------------------*/
        (function() {
            var num1 = $('#num1');
            var num2 = $('#num2');
            var num3 = $('#num3');
            var input1 = $('#input1');
            var input2 = $('#input2');
            var input3 = $('#input3');

            num1.text(string.blength(input1.val() || ''));
            num2.text(string.blength(input2.val() || '', true));
            num3.text(input3.val().length);

            inputx.reg(input1, function(val, lastInput, rangeData) {
                num1.text(string.blength(input1.val() || ''));
            });
            inputx.reg(input2, function(val, lastInput, rangeData) {
                num2.text(string.blength(input2.val() || '', true));
            });
            inputx.reg(input3, function(val, lastInput, rangeData) {
                num3.text(input3.val().length);
            });
        })();

        /**--------------------------------------------
         * 实例2： textarea 自动高度
         * --------------------------------------------*/
        (function() {
            var input4 = $('#input4');

            inputx.autoHeight(input4);
            inputx.reg(input4, function(val, lastInput, rangeData) {
                inputx.autoHeight(input4);
            });
        })();

        /**--------------------------------------------
         * 实例3： 实时格式检测
         * --------------------------------------------*/
        (function() {
            var input5 = $('#input5');
            var result1 = input5.prev('.input-result').eq(0);
            var check = function(val) {
                if(regexp.email.test(val)) {
                    result1.text('格式正确');
                } else {
                    result1.text('格式错误，正确格式示范：username@gmail.com');
                }
            };
            check(input5.val());
            inputx.reg(input5, function(val, lastInput, rangeData) {
                check(val);
            });
        })();

        /**--------------------------------------------
         * 实例4： 输入响应
         * --------------------------------------------*/
        (function() {
            var input6 = $('#input6');
            var input7 = $('#input7');
            var result1 = input6.prev('.input-result').eq(0);
            var result2 = input7.prev('.input-result').eq(0);

            inputx.reg(input6, function(val, lastInput, rangeData) {
                if(lastInput == '@') {
                    result1.text(rangeData.start + '位置检测输入@');
                } else {
                    result1.text('当前输入位置:' + rangeData.start + '，字符：' + lastInput);
                }
            });

            inputx.reg(input7, function(val, lastInput, rangeData) {
                var offset = inputx.position.offset(input7);
                if(lastInput == '@') {
                    result2.text(rangeData.start + '位置检测输入@，坐标 left:' + offset.left + ', top:' + offset.top);
                } else if(lastInput == '#') {
                    result2.text(rangeData.start + '位置检测输入#，坐标 left:' + offset.left + ', top:' + offset.top);
                } else {
                    result2.text('当前输入位置:' + rangeData.start + '，字符：' + lastInput);
                }
            });
        })();

        /**--------------------------------------------
         * 实例5： 插入
         * --------------------------------------------*/
        (function() {
            var face = $('#face');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var input8 = $('#input8');
            var input9 = $('#input9');
            var topic = $('#topic');
            // 表情功能
            face.click(function(e) {
                var target = e.target;
                if(target.tagName.toUpperCase() == 'A') {
                    var node = $(target);
                    var text = node.text() + ' ';
                    inputx.insert(input8, text);
                    face.hide();
                    return false;
                }
            });
            btn3.click(function(e) {
                face.toggle();
            });

            // 话题功能
            btn4.click(function(e) {
                var text = $.trim(topic.val());
                if(text) {
                    text = '#' + text + '#';
                    var pos = input9.val().indexOf(text);
                    if(pos == -1) {
                        inputx.insert(input9, text, function(pos, text, rangeData) {
                            inputx.select(input9, pos + 1, pos + text.length - 1);
                        });
                    } else {
                        inputx.select(input9, pos + 1, pos + text.length - 1);
                    }
                }
            });
        })();

        /**--------------------------------------------
         * 实例6： 选择
         * --------------------------------------------*/
        (function() {
            var input10 = $('#input10');
            var btn1 = $('#btn1');
            var text1 = $('#text1');
            var text2 = $('#text2');

            btn1.click(function(e) {
                inputx.select(input10, text1.val(), text2.val());
            });
        })();
    });
});
