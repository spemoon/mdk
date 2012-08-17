define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    // var xxx = require('{../../../../../../../js/}');
    var suggest = require('../../../../../../lib/util/core/dom/suggest.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var input1 = $('#input1');
            var container1 = $('#container1');

            suggest.reg(input1, {
                url: 'data.php',
                container: container1,
                list: '.item',
                build: function(container, data) {
                    var html = [];
                    data = data.data;
                    for(var i = 0, len = data.length; i < len; i++) {
                        html[i] = '<div class="item"><a href="#" >' + data[i].name + '</a></div>';
                    }
                    container.html(html.join(''));
                },
                select: function(item) {
                    this.val(item.find('a').text());
                    return false;
                }
            });
        })();
    });
});
