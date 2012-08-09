define(function(require, exports, module) {
    require('./plugin.css');
    var date = require('../../../../../../lib/util/core/date.js');
    var action = require('../../../../../../lib/util/core/dom/action.js');

    var tpl = {
        plugin: require('./tpl/plugin.tpl.js')
    };

    return function(node, data, status, params) {
        if(status == 'success') {
            node[0].innerHTML = tpl.plugin.render({
                poem: data.data.poem,
                pageTime: date.format(new Date(data.data.time * 1000), 'yyyy-MM-dd HH:mm:ss')
            });

            action.listen({
                getPoem: function(e) {
                    var poemNode = node.find('.plugin-poem');
                    params.xhr.plugin.send({
                        url: './data/plugin.php', // 外挂方式ajax请求地址最好使用绝对地址，因为这个地址解析以执行脚本的页面为基准页面
                        before: function() {
                            poemNode.hide();
                        },
                        success: function(data) {
                            poemNode.html(data.data.poem).fadeIn();
                        }
                    });
                }
            });
        }
    };
});