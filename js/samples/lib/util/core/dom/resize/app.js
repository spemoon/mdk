define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var resize = require('../../../../../../lib/util/core/dom/resize.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var box1 = $('#box1');
            resize.reg({
                node: box1,
                all: true
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            var box2 = $('#box2');
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            var box3 = $('#box3');
            resize.reg({
                node: box3,
                dir: {
                    se: true
                }
            }).bind({
                    resize: function(e, mouse, dir, node, startPosition, params) {
                        document.getElementById('box3').style.width = node.width() + 'px';
                        document.getElementById('box3').style.height = node.height() + 'px';
                    }
                });

        })();
    });
});
