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
            sort.reg({
                node: $('#box5'),
                item: 'li',
                filter: function(item, i, items, node) {
                    return !item.find(':checkbox').eq(0)[0].checked;
                }
            });
        })();
    });
});
