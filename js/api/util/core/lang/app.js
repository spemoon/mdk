define(function(require, exports, module) {
    require('../../../api_page.js');
    var $ = require('../../../../lib/jquery/1.7.1/sea_jquery.js');
    var lang = require('../../../../lib/util/core/lang.js');
    
    $(function() {
        // 实例代码
		/**--------------------------------------------
         * 实例一：继承的使用
         * --------------------------------------------*/
        (function() {
            var box1 = $('#result1');
            var btn1 = $('#btn1');
			// 父类
            var P = function(name) {
                this.name = name;
            };
			P.prototype.introduce = function() {
				return 'my name is:' + this.name;
			};
			P.prototype.hello = function() {
                return 'hello, ' + this.introduce();
            };
			// 子类
			var S = function(name, age) {
				P.call(this, name); // 构造器继承
				this.age = age;
			};
			lang.extend(S, P); // 原型链继承
			S.prototype.hello = function() { // 覆盖父类的方法
				return 'hello, baby.';
			};
			S.prototype.hi = function(name) { // 子类扩展的方法
				return 'hi, ' + name + ', ' + this.introduce(); // 使用继承来的方法
			};
			
			btn1.click(function() {
				var s = new S('David', 23);
				var html = [];
				html[0] = s.introduce(); // 使用继承而来的方法
				html[1] = s.hello(); // 使用override的方法
				html[2] = s.hi('Sarry'); // 使用子类自己的方法
				html[3] = s.superClass.hello.call(s); // 使用子类同名方法被覆盖的父类方法
				box1[0].innerHTML += html.join('<br/>') + '<hr/>';
			});
			
        })();
        /**--------------------------------------------
         * 实例二：展示越来越慢
         * --------------------------------------------*/
        (function() {
            var box2 = $('#result2');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            
            var flag = true;
            var helper = {
                init: function() {
                    btn2.removeAttr('disabled');
                    btn3.attr('disabled', 'disabled');
                },
                enable: function() {
                    flag = false;
                    helper.init();
                },
                disable: function() {
                    flag = true;
                    btn2.attr('disabled', 'disabled');
                    btn3.removeAttr('disabled');
                }
            };
            helper.init();
            var timer;
            btn2.click(function() {
                var i = 1;
                timer = lang.timer({
                    fn: function() {
                        box2[0].innerHTML += i + ', ';
                    },
                    rule: function() {
                        return i <= 15;
                    },
                    step: function() {
                        return (i++) * 128;
                    },
                    start: helper.disable,
                    end: helper.enable
                });
            });
            
            btn3.click(function() {
                if (timer) {
                    timer.stop();
                }
            });
        })();
        /**--------------------------------------------
         * 实例三：按钮倒计时
         * --------------------------------------------*/
        (function() {
            var box3 = $('#result3');
            var btn4 = $('#btn4');
            
            btn4.removeAttr('disabled');
            btn4.click(function() {
                var i = 10;
                var v = this.value;
                lang.timer({
                    fn: function() {
                        this.value = i + '秒后可以使用';
                        box3[0].innerHTML += '---';
                    },
                    rule: function() {
                        return i-- > 1;
                    },
                    step: 1000,
                    scope: this,
                    start: function() {
                        $(this).attr('disabled', 'disabled');
                        box3[0].innerHTML += '开始倒计时了';
                    },
                    end: function() {
                        $(this).removeAttr('disabled').val(v);
                        box3[0].innerHTML += '---> 结束了<br/>';
                    }
                });
            });
        })();
    });
});
