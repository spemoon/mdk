define(function(require, exports, module) {
    require('../../../api_page.js');
    var $ = require('../../../../lib/jquery/1.7.1/sea_jquery.js');
    var string = require('../../../../lib/util/core/string.js');
    
    $(function() {
        /**--------------------------------------------
         * 实例一：JSON序列化
         * --------------------------------------------*/
        (function() {
            var box1 = $('#result1');
            var btn1 = $('#btn1');
            btn1.click(function() {
                var obj = {
                    name: 'John',
                    sex: 1,
                    some: [1, 2, 3]
                };
                box1.html(string.serialize(obj));
            });
        })();
    });
});
