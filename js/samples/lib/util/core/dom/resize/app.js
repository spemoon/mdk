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
            var box8 = $('#box8');
            var box9 = $('#box9');
            var box10 = $('#box10');
            resize.reg({
                node: box1,
                all: true
            });

            resize.reg({
                node: box8,
                all: true
            });

            resize.reg({
                node: box9,
                all: true
            });

            resize.reg({
                node: box10,
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
                paddingBottom: box2.find('.n').height() + box2.find('.s').height() + box2.find('.header').height() + box2.find('.footer').height()
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

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            resize.reg({
                node: $('#box4'),
                proxy: true,
                all: true
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            var box5 = $('#box5');
            var content = box5.find('.content');
            resize.reg({
                node: box5,
                sizeNode: content,
                proxy: true,
                dir: {
                    ne: box5.find('.ne'),
                    n: box5.find('.n'),
                    nw: box5.find('.nw'),
                    se: box5.find('.se'),
                    s: box5.find('.s'),
                    sw: box5.find('.sw'),
                    e: box5.find('.e'),
                    w: box5.find('.w')
                },
                minWidth: 150,
                minHeight: 80,
                paddingRight: box5.find('.e').width() + box5.find('.w').width(),
                paddingBottom: box5.find('.n').height() + box5.find('.s').height() + box5.find('.header').height() + box5.find('.footer').height()
            });
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function() {
            resize.reg({
                node: $('#box6'),
                all: true,
                minWidth: 100,
                maxWidth: 500,
                minHeight: 80,
                maxHeight: 250
            });
        })();

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        (function() {
            resize.reg({
                node: $('#box7'),
                all: true
            }).bind({
                    start: function(event, e, handle, node, targetNode, targetSizeNode, startPosition) {
                        console.log('start');
                    },
                    resize: function(event, e, position, params) {
                        console.log(position);
                    },
                    end: function(event, e, handle, node, startPosition) {
                        console.log('end');
                    }
                });
        })();
    });
});
