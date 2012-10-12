define(function(require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var pagination = require('../../../../../lib/cmp/core/pagination.js');

    var helper = {
        random: function(max, min) {
            max = max || 200;
            min = min || 0;
            return Math.ceil(Math.random() * (max - min)) + min;
        },
        page: function() {
            var data = {
                url: 'data.php',
                before: function() {
                    $('#data').html('载入中，这里通常做个mask');
                },
                success: function() {
                    $('#data').html('获取数据成功，这里通常拼装数据展示');
                }
            };
            data.size = helper.random(11, 5);
            data.total = helper.random();
            data.current = helper.random(parseInt(data.total / data.size));
            $('#info').html('<ul><li>初始化设置数据：</li><li>总数：' + data.total + '</li><li>每页数：' + data.size + '</li><li>后端查询总数：100</li></ul>');
            return data;
        }
    };

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var p = new pagination({
                renderTo: '#bar',
                params: helper.page()
            });
            p.init().render();
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            var search = location.search;
            var pagesize = search.match(/pagesize=(\d+)/);
            var page = search.match(/page=(\d+)/);
            pagesize = pagesize ? pagesize[1] : 8;
            page = page ? page[1] : 8;
            var p = new pagination({
                renderTo: '#bar2',
                params: {
                    url: '',
                    ajax: false,
                    size: pagesize,
                    total: 123,
                    current: page
                }
            });
            p.init().render();
        })();
    });
});
