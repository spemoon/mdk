define(function(require, exports, module) {
    require('../../../../../../sample.js');
    var $ = require('jquery');
    // var xxx = require('{../../../../../../../../js/}');
    var placeholder = require('../../../../../../../lib/util/core/dom/html5/placeholder.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var input1 = $('#input1');
            var textarea1 = $('#textarea1');

            var v1 = placeholder.reg(textarea1);
            var v2 = placeholder.reg(input1);

        })();
    });
});
