define(function(require, exports, module) {
    require('../../../api_page.js');
    var $ = require('../../../../lib/jquery/1.7.1/sea_jquery.js');
    var ajax = require('../../../../lib/util/core/ajax.js');
    
    $(function() {
        var helper = {
            getTime: function() {
                var d = new Date();
                return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ';
            }
        };
        
        /**--------------------------------------------
         * 实例1：AJAX 基础请求
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var box1 = $('#result1');
            btn1.click(function() {
                var time = helper.getTime();
                ajax.base({
                    url: 'data.php',
					before: function() {
						btn1.attr('disabled', 'disabled');
					},
                    error: function(xhr, status) {
                        box1.append('<p>' + time + '，结果是：error</p>');
                    },
                    failure: function(data) {
                        box1.append('<p>' + time + '，结果是：failure</p>');
                    },
                    permission: function(data) {
                        box1.append('<p>' + time + '，结果是：no permission</p>');
                    },
                    success: function(data) {
                        box1.append('<p>' + time + '，结果是：success</p>');
                    },
                    complete: function(xhr, status) {
                        btn1.removeAttr('disabled');
                    }
                });
            });
        })();
        
        /**--------------------------------------------
         * 实例2：AJAX 单例模式
         * --------------------------------------------*/
        (function() {
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var box2 = $('#result2');
            var as = ajax.single('test'); // 声明一个单例模式
            btn2.click(function() {
                var time = helper.getTime();
                as.send({
                    url: 'data.php',
                    data: {
                        word: 'hello'
                    },
                    error: function(xhr, status) {
                        box2.html('<p>' + time + 'btn2，结果是：error</p>');
                    },
                    failure: function(data) {
                        box2.html('<p>' + time + 'btn2，结果是：failure</p>');
                    },
                    permission: function(data) {
                        box2.html('<p>' + time + 'btn2，结果是：no permission</p>');
                    },
                    success: function(data) {
                        box2.html('<p>' + time + 'success: btn2' + data.data + '，结果是：success</p>');
                    }
                });
            });
            btn3.click(function() {
                var time = helper.getTime();
                as.send({
                    url: 'data.php',
                    data: {
                        word: 'world'
                    },
                    error: function(xhr, status) {
                        box2.html('<p>' + time + 'btn3，结果是：error</p>');
                    },
                    failure: function(data) {
                        box2.html('<p>' + time + 'btn3，结果是：failure</p>');
                    },
                    permission: function(data) {
                        box2.html('<p>' + time + 'btn3，结果是：no permission</p>');
                    },
                    success: function(data) {
                        box2.html('<p>' + time + 'btn3 ' + data.data + '，结果是：success</p>');
                    }
                });
            });
        })();
        
        /**--------------------------------------------
         * 实例3：AJAX 连接池模式
         * --------------------------------------------*/
        (function() {
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
			var btn6 = $('#btn6');
            var btn7 = $('#btn7');
			var btn8 = $('#btn8');
            var box3 = $('#result3');
			var box4 = $('#result4');
			var box5 = $('#result5');
            var ap = ajax.pool('test', 3, 5); // 声明一个连接池，名字test，最大并发数3，优先级一共分为5个
            var id = 0;
            var action = function(priority) {
                var time = helper.getTime();
				var qid = ++id;
                ap.add({
                    url: 'data.php',
					before: function() {
						box4.append('<p>' + time + '发出：' + qid + '，优先级为 -- ' + priority + '</p>');
					},
                    error: function(xhr, status) {
                        box5.append('<p>' + time + '结果：' + qid + '，优先级为 -- ' + priority + '，结果是：error</p>');
                    },
                    failure: function(data) {
                        box5.append('<p>' + time + '结果：' + qid + '，优先级为 -- ' + priority + '，结果是：failure</p>');
                    },
                    permission: function(data) {
                        box5.append('<p>' + time + '结果：' + qid + '，优先级为 -- ' + priority + '，结果是：no permission</p>');
                    },
                    success: function(data) {
                        box5.append('<p>' + time + '结果：' + qid + '，优先级为 -- ' + priority + '，结果是：success</p>');
                    }
                }, priority);
				box3.append('<p>插入：' + qid + '，优先级为 -- ' + priority + '</p>');
            };
            btn4.click(function() {
                action(1);
            });
            btn5.click(function() {
                action(2);
            });
			btn6.click(function() {
                action(3);
            });
			btn7.click(function() {
                action(4);
            });
			btn8.click(function() {
                action(5);
            });
        })();
    });
});
