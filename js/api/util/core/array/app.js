define(function(require, exports, module) {
    require('../../../api_page.js');
    var $ = require('../../../../lib/jquery/1.7.1/sea_jquery.js');
    var array = require('../../../../lib/util/core/array.js');

    $(function() {
        /**--------------------------------------------
         * 实例一：indexOf使用
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var box1 = $('#result1');
            var arr = [1, 3, 4, 6, 6, 8, 9];
            var show = function(v) {
                var i = array.indexOf(v, arr);
                var html = '';
                if(i != -1) {
                    html += '找到 ' + v + '，位置是：' + i;
                } else {
                    html += '没找到 ' + v;
                }
                html += '<br/>';
                box1[0].innerHTML = html;
            };

            btn1.click(function() {
                show(6);
            });
            btn2.click(function() {
                show(7);
            });
        })();

        /**--------------------------------------------
         * 实例二：forEach使用
         * --------------------------------------------*/
        (function() {
            var btn3 = $('#btn3');
            var box2 = $('#result2');
            var arr = [1, 3, 4, 6, 6, 8, 9];
            
            btn3.click(function() {
                array.forEach(function(v, i, arr) {
                    box2[0].innerHTML += '第 ' + i + '个元素：' + v + ' 的平方是：' + (v * v) + '<br/>';
                }, arr);
            });
        })();
    });
});
