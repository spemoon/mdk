define(function (require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var dialog = require('../../../../../lib/cmp/core/dialog');

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
            var btn1 = $('#btn1');
            var d;
            btn1.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world'
                        }
                    });
                    d.init();
                }
                d.render();

                setTimeout(function () {
                    d.setTitle('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx').setContent('<p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>');
                }, 2000);
            });
        })();
    });
});
