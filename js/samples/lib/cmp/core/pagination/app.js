define(function (require, exports, module) {
    var $ = require('jquery');
    var pagination = require('../../../../../lib/cmp/core/pagination.js');

    var helper = {
        random:function (max, min) {
            max = max || 200;
            min = min || 0;
            return Math.ceil(Math.random() * (max - min)) + min;
        }
    };

    $(function () {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function () {
            new pagination({
                renderTo:'#bar',
                params: {
                    url: 'data.php',
                    size: helper.random(11, 5),
                    total: helper.random(),
                    current: helper.random(parseInt(data.total / data.size)),
                    before:function () {
                        $('#data').html('载入中，这里通常做个mask');
                    },
                    success:function () {
                        $('#data').html('获取数据成功，这里通常拼装数据展示');
                    }
                }
            }).init().render();
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function () {
            var search = location.search;
            var pagesize = search.match(/pagesize=(\d+)/);
            var page = search.match(/page=(\d+)/);
            pagesize = pagesize ? pagesize[1] : 8;
            page = page ? page[1] : 8;
            var p = new pagination({
                renderTo:'#bar2',
                params:{
                    url:'',
                    ajax:false,
                    size:pagesize,
                    total:123,
                    current:page
                }
            });
            p.init().render();
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function () {
            var p = new pagination({
                renderTo:'#bar3',
                params: {
                    data:(function() {
                        var arr = [];
                        for(var i = 0; i < 213; i++) {
                            arr[i] = i;
                        }
                        return arr;
                    })(),
                    success: function(data) {
                        $('#info3').text(data);
                    }
                }
            });
            p.init().render();
        })();
    });
});
