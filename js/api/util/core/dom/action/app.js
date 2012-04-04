define(function(require, exports, module) {
	require('../../../../api_page.js');
	var $ = require('../../../../../lib/jquery/1.7.1/sea_jquery.js');
    var action = require('../../../../../lib/util/core/dom/action.js');
	
    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var options = $('#options'); // 下拉列表
            var text = $('#text'); // 下拉结果存放
            var list = $('#list'); // 新闻列表
            var index = 1;
            action.listener({
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
            action.listener({
                add: function(e) {
                    list.children('li').eq(0).after('<li>这是一条插入的最新新闻 ' + (index++) + ' <a href="#" data-action="del">删除</a></li>');
                },
                del: function(e) {
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
