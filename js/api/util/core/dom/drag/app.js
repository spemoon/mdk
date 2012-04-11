define(function(require, exports, module) {
	require('../../../../api_page.js');
	var $ = require('../../../../../lib/jquery/1.7.1/sea_jquery.js');
    var drag = require('../../../../../lib/util/core/dom/drag.js');
	
    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var drag1 = $('#drag1');
            drag.reg(drag1);
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            var drag2 = $('#drag2');
            var handle = drag2.children('.handle');
            drag.reg(handle, {
                node: drag2
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            var drag3 = $('#drag3');
            var except3 = drag3.children('.except');
            drag.reg(drag3, {
                except: except3
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            var drag4 = $('#drag4');
            var box1 = $('#box1');
            drag.reg(drag4, {
                container: box1
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            var drag5 = $('#drag5');
            var drag6 = $('#drag6');
            drag.reg(drag5, {
                axisX:true
            });
            drag.reg(drag6, {
                axisY:true
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            var drag7 = $('#drag7');
            var drag8 = $('#drag8');
            drag.reg(drag7, {
                proxy:true,
                dashed: true
            });
            drag.reg(drag8, {
                proxy:true
            });
        })();
    });
});
