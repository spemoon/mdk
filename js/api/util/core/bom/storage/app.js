define(function(require, exports, module) {
    require('../../../../api_page.js');
    var $ = require('../../../../../lib/jquery/1.7.1/sea_jquery.js');
    var storage = require('../../../../../lib/util/core/bom/storage.js');
    
    $(function() {
        /**--------------------------------------------
         * 实例1： localStorage的存入，读取，删除，清空
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var txt1 = $('#txt1');
			var txt2 = $('#txt2');
            btn1.click(function() {
                storage.set('val', txt1.val());
            });
            btn2.click(function() {
                alert(storage.get('val'));
            });
			btn3.click(function() {
                storage.set('word', txt2.val());
            });
            btn4.click(function() {
                alert(storage.get('word'));
            });
        })();
    });
});
