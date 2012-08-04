define(function(require, exports, module) {
	require('../../../../../sample.js');
	var $ = require('../../../../../../lib/jquery/sea_jquery.js');
    var action = require('../../../../../../lib/util/core/dom/action.js');
	
    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var options = $('#options'); // 下拉列表
            var text = $('#text'); // 下拉结果存放
            var list = $('#list'); // 新闻列表
            var index = 1;
            action.listen({
                select: {
                    is: function(e) {
                        options.toggle();
                    },
                    not: function(e) {
                        options.hide();
                    }
                },
                item: function(e) {
                    text.text(this.text());
                },
                add: function(e) {
                    list.children('li').eq(0).after('<li>这是一条插入的最新新闻 ' + (index++) + ' <a href="#" data-action="del">删除</a></li>');
                },
                del: function(e) {
                    this.parents('li').remove();
                }
            });
            // 后面注册同类型的冒泡事件是无效的
            action.listen({
                add: function(e) {
                    list.children('li').eq(0).after('<li>------这是一条插入的最新新闻 ' + (index++) + ' <a href="#" data-action="del">删除</a></li>');
                },
                del: function(e) {
                    console.log('----------');
                    this.parents('li').remove();
                }
            });

            options.children('li').hover(function() {
                $(this).addClass('hover');
            }, function() {
                $(this).removeClass('hover');
            });
        })();
    });
});
