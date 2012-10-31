define(function (require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var slider = require('../../../../../lib/cmp/core/slider');

    var helper = {
        random:function (n) {
            n = n || 800;
            return Math.ceil(Math.random() * n);
        }
    };

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
