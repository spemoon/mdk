define(function (require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var progress = require('../../../../../lib/cmp/core/progress');

    $(function () {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function () {
            var s = new progress({
                renderTo: '#box'
            });
            s.init().render().setValue(30);

            $('#btn').click(function(e) {
                s.setValue(Math.round($('#val').val()));
            });
        })();
    });
});
