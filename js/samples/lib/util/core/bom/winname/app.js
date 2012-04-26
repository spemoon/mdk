define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('../../../../../../lib/jquery/1.7.1/sea_jquery.js');
    var winname = require('../../../../../../lib/util/core/bom/winname.js');
    
    $(function() {
        /**--------------------------------------------
         * 实例1： 设置，读取和删除window.name
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');
            btn1.click(function() {
                winname.set('name', 'jim');
            });
            btn2.click(function() {
                winname.set('name', 'tom');
            });
            btn3.click(function() {
                winname.set('age', '34');
            });
            btn4.click(function() {
                winname.del('name');
            });
            btn5.click(function() {
                alert(winname.get('name'));
            });
            btn6.click(function() {
                alert(winname.get('age'));
            });
        })();
        
        /**--------------------------------------------
         * 实例2： 利用window.name获取跨域数据
         * --------------------------------------------*/
        (function() {
            var btn7 = $('#btn7');
            btn7.click(function() {
                winname.proxy('http://mm.com/mdk/js/api/util/core/bom/winname/data.php?name=jerry', 'empty.html', function(data) {
                    alert(data);
                }, {
                    before: function() {
                        btn7.attr('disabled', 'disabled');
                    },
                    complete: function() {
                        btn7.removeAttr('disabled');
                    }
                });
            });
        })();
    });
});
