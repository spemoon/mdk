define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var scroll = require('../../../../../../lib/util/core/dom/scroll.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var box1 = $('#box1');
            btn1.click(function() {
                scroll.to(box1, 'top');
            });
            btn2.click(function() {
                scroll.to(box1, 'bottom');
            });
            btn3.click(function() {
                scroll.to(box1, 50);
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            var box3 = $('#box3');
            scroll.prevent(box3);
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            var box4 = $('#box4');
            scroll.listen(box4, {
                top: function(e, scrollTop, dir, status) {
                    console.log('滚到容器顶部');
                },
                bottom: function(e, scrollTop, dir, status) {
                    console.log('滚到容器底部');
                    setTimeout(function() {
                        box4.append('<p>123</p><p>123</p><p>123</p>');
                    }, 500);
                },
                other: function(e, scrollTop, dir, status) {
                    if(scrollTop < 200 && dir == 'up') {
                        console.log('距离容器顶部小于100px且向上滚动');
                    }
                    if((scrollTop > status.bottom - 250) && dir == 'down') {
                        console.log('距离容器底部小于250px且向下滚动');
                    }
                }
            });

            scroll.listen(window, {
                top: function(e, scrollTop, dir, status) {
                    console.log('滚到document顶部');
                },
                bottom: function(e, scrollTop, dir, status) {
                    console.log('滚到document底部');
                },
                other: function(e, scrollTop, dir, status) {
                    if(scrollTop < 200 && dir == 'up') {
                        console.log('距离document顶部小于200px且向上滚动');
                    }
                    if((scrollTop > status.bottom - 250) && dir == 'down') {
                        console.log('距离document底部小于250px且向下滚动');
                    }
                }
            });
        })();
    });
});
