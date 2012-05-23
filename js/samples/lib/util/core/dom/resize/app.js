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
            var content = box2.find('.content');
            resize.reg({
                node: box2,
                sizeNode: content,
                dir: {
                    ne: box2.find('.ne'),
                    n: box2.find('.n'),
                    nw: box2.find('.nw'),
                    se: box2.find('.se'),
                    s: box2.find('.s'),
                    sw: box2.find('.sw'),
                    e: box2.find('.e'),
                    w: box2.find('.w')
                },
                minWidth: 150,
                minHeight: 80,
                paddingRight: box2.find('.e').width() + box2.find('.w').width(),
                paddingBottom: box2.find('.n').height() + box2.find('.s').height() + box2.find('.header').height() + box2.find('.footer').height(),
            }).bind({
                });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            resize.reg({
                node: $('#box3')
            });

        })();
    });
});
