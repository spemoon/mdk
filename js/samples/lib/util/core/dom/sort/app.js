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
            box5.find(':checkbox').click(function() {
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
            box6.find(':checkbox').click(function() {
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
                item: 'li'
            });
        })();
    });
});
