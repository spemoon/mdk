define(function (require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var slider = require('../../../../../lib/cmp/core/slider');

    $(function () {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function () {
            var s = new slider({
                renderTo: '#box',
                params: {
                    afterSetValue: function(val) {
                        $('#val').val(Math.round(val));
                    }
                }
            });
            s.init().render();

            $('#btn').click(function(e) {
                s.setValue(Math.round($('#val').val()));
            });
        })();
    });
});
