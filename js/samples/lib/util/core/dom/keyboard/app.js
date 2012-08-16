define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var keyboard = require('../../../../../../lib/util/core/dom/keyboard.js');
    var array = require('../../../../../../lib/util/core/array.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：ctrl + enter
         * --------------------------------------------*/
        (function() {
            var content1 = $('#content1');
            keyboard.ctrlEnter(content1, function(e) {
                alert(this.val());
            });
        })();

        /**--------------------------------------------
         * 实例2：热键系统示范
         * --------------------------------------------*/
        (function() {
            // 创建一个div弹出层以备示范
            $(document.body).append('<div class="window"><a href="#" class="close">X</a><div class="body"></div></div>');
            var win = $('.window:last').eq(0);
            var body = win.children('div:first').eq(0);
            win.children('a:first').eq(0).click(function() {
                helper.win.hide();
                return false;
            });
            // 创建一个滑块以备示范
            $(document.body).append('<div class="slider">按住键盘方向键上下左右移动</div>');
            var slider = $('.slider:last').eq(0);

            var helper = {
                // 弹出层屏幕居中
                center:function(node, width) {
                    var w = $(window);
                    node.css({
                        width:width || 375,
                        left:Math.max((w.width() - (width || node.width())) / 2 + w.scrollLeft(), 10),
                        top:Math.max((w.height() - node.height()) / 2 + w.scrollTop(), 10)
                    }).show();
                },
                win:{
                    show:function(html, width) {
                        body.html(html);
                        helper.center(win, width);
                    },
                    hide:function() {
                        win.hide();
                    },
                    search:function(url) {
                        url = url || 'http://www.baidu.com/';
                        helper.win.show('<iframe border="0" frameborder="0" src="' + url + '"></iframe>', 800);
                    }
                },
                slider:{
                    show:function() {
                        if(slider.is(':hidden')) {
                            helper.center(slider, slider.width());
                        }
                    },
                    hide:function() {
                        slider.hide();
                    },
                    move:function(dir) {
                        if(slider.is(':visible')) {
                            if(dir == 'up') {
                                slider.css('top', Math.max(parseInt(slider.css('top')) - 20, $(window).scrollTop()));
                            } else if(dir == 'down') {
                                slider.css('top', Math.min(parseInt(slider.css('top')) + 20, $(window).scrollTop() + $(window).height() - slider.outerHeight()));
                            } else if(dir == 'left') {
                                slider.css('left', Math.max(parseInt(slider.css('left')) - 20, $(window).scrollLeft()));
                            } else if(dir == 'right') {
                                slider.css('left', Math.min(parseInt(slider.css('left')) + 20, $(window).scrollLeft() + $(window).width() - slider.outerWidth()));
                            }
                        } else {
                            return true;
                        }
                    }
                }
            };

            keyboard.hotKey({
                '?':function() {
                    helper.win.show($('#help').html());
                },
                '!':function() {
                    alert('!!!!!!!!');
                },
                'h, e,l,l,o':function() {
                    helper.win.show('hello world');
                },
                's':function() {
                    helper.win.search();
                },
                'g, s':function() {
                    helper.win.search('https://www.google.com/');
                },
                'g,o,o,g,l,e':function() {
                    helper.win.search('https://www.google.com/');
                },
                'esc': function() {
                    helper.win.hide();
                },
                'a':function() {
                    helper.slider.show();
                },
                'shift+a':function() {
                    helper.slider.hide();
                }
            });

            array.forEach(function(v, i, arr) {
                keyboard.hotKey(v, {
                    callback:function() {
                        return helper.slider.move(v);
                    },
                    hold:true
                });
            }, ['up', 'down', 'left', 'right']);
        })();
    });
});
