define(function(require, exports, module) {
    require('../../../api_page.js');
    var $ = require('../../../../lib/jquery/1.7.1/sea_jquery.js');
    var string = require('../../../../lib/util/core/string.js');
    
    $(function() {
        /**--------------------------------------------
         * 实例1：JSON序列化
         * --------------------------------------------*/
        (function() {
            var box1 = $('#result1');
            var btn1 = $('#btn1');
            btn1.click(function() {
                var obj = {
                    name: 'John',
                    sex: 1,
                    some: [1, 2, 3]
                };
                box1.html(string.serialize(obj));
            });
        })();

        /**--------------------------------------------
         * 实例2：计算文本长度，全角算2个长度
         * --------------------------------------------*/
        (function() {
            var box2 = $('#result2');
            var btn2 = $('#btn2');
            btn2.click(function() {
                alert(string.blength(box2[0].innerHTML));
            });
        })();

        /**--------------------------------------------
         * 实例3：截取字符串
         * --------------------------------------------*/
        (function() {
            var box3 = $('#result3');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');
            var text = box3[0].innerHTML;
            btn3.click(function() {
                alert(string.cut(text, 35));
            });
            btn4.click(function() {
                alert(string.cut(text, 58));
            });
            btn5.click(function() {
                alert(string.cut(text, 35, {
                    fullSharp: true
                }));
            });
            btn6.click(function() {
                alert(string.cut(text, 35, {
                    fullSharp: true,
                    pad: 'right'
                }));
            });
        })();

        /**--------------------------------------------
         * 实例4：字符串转义与反转义
         * --------------------------------------------*/
        (function() {
            var box4 = $('#result4');
            var btn7 = $('#btn7');
            var btn8 = $('#btn8');
            btn7.click(function() {
                box4[0].innerHTML = string.code(box4[0].innerHTML);
            });
            btn8.click(function() {
                box4[0].innerHTML = string.code(box4[0].innerHTML, true);
            });
        })();
    });
});
