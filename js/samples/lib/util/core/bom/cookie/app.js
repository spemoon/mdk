define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var cookie = require('../../../../../../lib/util/core/bom/cookie.js');

    $(function() {
        /**--------------------------------------------
         * 实例一：cookie设置
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            btn1.click(function() {
                cookie.set('nick', 'jerry', 15 * 1000);
            });
            btn2.click(function() {
                var nick = cookie.get('nick');
                if(nick) {
                    alert('找到nick，值是：' + nick);
                } else {
                    alert('没找到nick');
                }
            });
        })();

        /**--------------------------------------------
         * 实例2：设置多个cookie
         * --------------------------------------------*/
        (function() {
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            btn3.click(function() {
                cookie.sets({
                    nick:'jerry',
                    id:10086
                }, 15 * 1000);
            });
            btn4.click(function() {
                var nick = cookie.get('nick');
                var id = cookie.get('id');
                var result = '';
                if(nick) {
                    result += '找到nick，值是：' + nick;
                } else {
                    result += '没找到nick';
                }
                result += '\n';
                if(id) {
                    result += '找到id，值是：' + id;
                } else {
                    result += '没找到id';
                }
                alert(result);
            });
        })();

        /**--------------------------------------------
         * 实例3：删除cookie
         * --------------------------------------------*/
        (function() {
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');
            var btn7 = $('#btn7');
            var btn8 = $('#btn8');
            
            btn5.click(function() {
                cookie.sets({
                    nick:'jerry',
                    id:10086,
                    age: 25
                }, 15 * 1000);
            });
            btn6.click(function() {
                cookie.del('nick');
            });
            btn7.click(function() {
                cookie.del('id', 'age');
            });
            btn8.click(function() {
                var nick = cookie.get('nick');
                var id = cookie.get('id');
                var age = cookie.get('age');
                var result = '';
                if(nick) {
                    result += '找到nick，值是：' + nick;
                } else {
                    result += '没找到nick';
                }
                result += '\n';
                if(id) {
                    result += '找到id，值是：' + id;
                } else {
                    result += '没找到id';
                }
                result += '\n';
                if(age) {
                    result += '找到age，值是：' + age;
                } else {
                    result += '没找到age';
                }
                alert(result);
            });
        })();
    });
});
