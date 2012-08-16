define(function(require, exports, module) {
	require('../../../../sample.js');
    var $ = require('jquery');
    var date = require('../../../../../lib/util/core/date.js');
	
    $(function() {
        /**--------------------------------------------
         * 实例1：闰年检查
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            btn1.click(function() {
               alert(date.isLeap(2012));
            });
            btn2.click(function() {
                alert(date.isLeap(2013));
            });
        })();

        /**--------------------------------------------
         * 实例2：日期字符串合法性检查
         * --------------------------------------------*/
        (function() {
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');
            var btn7 = $('#btn7');
            btn3.click(function() {
                alert(date.check('2012-12-25'));
            });
            btn4.click(function() {
                alert(date.check('2012-1-25'));
            });
            btn5.click(function() {
                alert(date.check('2012-01-25'));
            });
            btn6.click(function() {
                alert(date.check('2012-12-25', 'yyyy/MM/dd'));
            });
            btn7.click(function() {
                alert(date.check('2012/12/25', 'yyyy/MM/dd'));
            });
        })();

        /**--------------------------------------------
         * 实例3：日期大小比较
         * --------------------------------------------*/
        (function() {
            var btn8 = $('#btn8');
            btn8.click(function() {
                alert(date.compare(new Date(2012, 3, 11), new Date(2012, 4, 11)));
            });
        })();

        /**--------------------------------------------
         * 实例4：日期字符串大小比较
         * --------------------------------------------*/
        (function() {
            var btn9 = $('#btn9');
            btn9.click(function() {
                alert(date.stringCompare('2012-3-11', 'yyyy-M-dd', '2012/04/11', 'yyyy/MM/dd'));
            });
        })();

        /**--------------------------------------------
         * 实例5：字符串转日期对象
         * --------------------------------------------*/
        (function() {
            var btn10 = $('#btn10');
            var btn11 = $('#btn11');
            btn10.click(function() {
                alert(date.stringToDate('2012-03-11'));
            });
            btn11.click(function() {
                alert(date.stringToDate('2012/04/11', 'yyyy/MM/dd'));
            });
        })();

        /**--------------------------------------------
         * 实例6：日期格式化成字符串输出
         * --------------------------------------------*/
        (function() {
            var btn12 = $('#btn12');
            var btn13 = $('#btn13');
            btn12.click(function() {
                alert(date.format(new Date()));
            });
            btn13.click(function() {
                alert(date.format(new Date(), 'yyyy/MM/dd HH:mm:ss'));
            });
        })();

        /**--------------------------------------------
         * 实例7：日期基准距离计算
         * --------------------------------------------*/
        (function() {
            var btn14 = $('#btn14');
            var btn15 = $('#btn15');
            var btn16 = $('#btn16');
            btn14.click(function() {
                alert(date.distance(new Date(), 25));
            });
            btn15.click(function() {
                alert(date.distance(new Date(), -2, 'M'));
            });
            btn16.click(function() {
                alert(date.distance(new Date(), 3, 'y'));
            });
        })();
    });
});
