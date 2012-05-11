define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var sort = require('../../../../../../lib/util/core/dom/sort.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box1'),
                item: 'li'
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box2'),
                item: 'li'
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box3'),
                item: 'li'
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box4'),
                item: 'li',
                handle: 'span'
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            var box5 = $('#box5');
            sort.reg({
                node: box5,
                item: 'li',
                filter: function(item, i, items, node) {
                    var flag = item.find(':checkbox').eq(0)[0].checked;
                    return flag ? 0 : true;
                }
            });
            box5.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('li').addClass('disabled');
                    } else {
                        $(this).parents('li').removeClass('disabled');
                    }
                }).removeAttr('checked');
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function() {
            var box6 = $('#box6');
            sort.reg({
                node: box6,
                item: 'li',
                filter: function(item, i, items, node) {
                    return !item.find(':checkbox').eq(0)[0].checked;
                }
            });
            box6.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('li').addClass('disabled');
                    } else {
                        $(this).parents('li').removeClass('disabled');
                    }
                }).removeAttr('checked');
        })();

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        (function() {
            var box7 = $('#box7');
            var box8 = $('#box8');

            sort.reg({
                node: box7,
                item: 'li',
                connect: box8
            });
            sort.reg({
                node: box8,
                item: 'li',
                connect: box7
            });
        })();

        /**--------------------------------------------
         * 实例8：
         * --------------------------------------------*/
        (function() {
            var box9 = $('#box9');
            var box10 = $('#box10');
            var box11 = $('#box11');

            sort.reg({
                node: box9,
                item: 'li',
                connect: $('#box10, #box11'),
                filter: function(item, i, items) {
                    var flag = item.find(':checkbox').eq(0)[0];
                    if(flag && flag.checked) {
                        flag = 0;
                    } else {
                        flag = true;
                    }
                    return flag;
                }
            });
            sort.reg({
                node: box10,
                item: 'li',
                connect: box11
            });
            sort.reg({
                node: box11,
                item: 'li',
                connect: box9
            });

            box9.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('li').addClass('disabled');
                    } else {
                        $(this).parents('li').removeClass('disabled');
                    }
                }).removeAttr('checked');
        })();

        /**--------------------------------------------
         * 实例9：
         * --------------------------------------------*/
        (function() {
            var box12 = $('#box12');
            var box13 = $('#box13');

            sort.reg({
                node: box12,
                item: 'li',
                connect: box13
            }).bind({
                    dragstart: function() {
                        console.log('dragstart');
                    },
                    placeholder: function(e, placeholder) {
                        placeholder.css({
                            border: '1px solid blue',
                            background: '#fff',
                            visibility: 'visible'
                        });
                        console.log('placeholder');
                    },
                    dragend: function() {
                        console.log('dragend');
                    }
                });
            sort.reg({
                node: box13,
                item: 'li',
                connect: box12
            });
        })();
    });
});
