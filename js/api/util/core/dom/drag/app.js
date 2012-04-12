define(function(require, exports, module) {
    require('../../../../api_page.js');
    var $ = require('../../../../../lib/jquery/1.7.1/sea_jquery.js');
    var drag = require('../../../../../lib/util/core/dom/drag.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag1')
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag2'),
                handle:'.handle'
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag3'),
                except:'.except'
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag4'),
                container:$('#box1')
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag5'),
                axisX:true
            });
            drag.reg({
                node:$('#drag6'),
                axisY:true
            });
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag7'),
                proxy:true,
                dashed:true
            });
            drag.reg({
                node:$('#drag8'),
                proxy:true
            });
        })();

        /**--------------------------------------------
         * 实例8：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag9'),
                scroll:true
            });
        })();

        /**--------------------------------------------
         * 实例8：
         * --------------------------------------------*/
        (function() {
            var box2 = $('#box2');
            var list = box2.find('.drag');
            list.click(function() {
                $(this).toggleClass('selected');
            });
            drag.reg({
                node:list,
                multi: function() {
                    return box2.find('.selected');
                }
            });

        })();
    });
});
