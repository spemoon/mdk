define(function(require, exports) {
    var $ = require('../lib/jquery/1.7.1/sea_jquery.js');
    // 语法高亮
    var highlighter = require('../lib/external/syntaxHighlighter/shBrushJScript.js');
    highlighter.highlight();
    
    // 每项标题
    $('.modual>h2').bind('selectstart', function() { // 不可选择
        return false;
    }).dblclick(function() { // toggle效果
        $(this).next('.content').slideToggle();
    }).wrapInner(function() { // 包裹成锚链接
        return '<a href="#' + $(this).text() + '"/>';
    });
    
    // 生成导航菜单 
    $(document.body).append(function() {
        var html = '<div class="navigation"><div class="nav-bar"><em>目录</em> [<a href="#" class="nav-toggle">收起</a>]</div><ul>';
        $('.modual>h2').each(function(i, item) {
            var node = $(this);
            var text = node.text();
            var id = text.split('.').join('_');
            node.parent().attr('id', id);
            html += '<li><a href="#' + id + '">' + text + '</a></li>';
        });
        html += '</ul></div>';
        return html;
    });
    $('.navigation:last').width($('.navigation:last').width());
    
    // 导航菜单的toggle
    $('.nav-toggle:last').click(function() {
        var node = $(this);
        var ul = node.parent().next('ul');
        if (ul.is(':visible')) {
            ul.slideUp(function() {
                node.text('展开');
            });
        } else {
            ul.slideDown(function() {
                node.text('收起');
            });
        }
        return false;
    });
    
    // 导航菜单定位的缓动
    var navigationNode = $('.navigation:last');
    var navActiveCls = 'nav-active';
    var highlightItem = function(hash) {
        navigationNode.find('.' + navActiveCls).removeClass(navActiveCls);
        navigationNode.find('a[href="' + hash + '"]').parent().addClass(navActiveCls);
    };
    var scrollFn = function(hash, callback) {
        if (hash && hash != '#') {
            var target = $(hash);
            if (target[0]) {
                var top = target.offset().top;
                $('html,body').stop().animate({
                    scrollTop: top
                }, function() {
                    var content = target.children('.content');
                    if (content.is(':hidden')) {
                        content.slideDown();
                    }
                    callback && callback(hash);
                });
            }
        }
    };
    $('.navigation:last>ul>li>a').click(function() {
        scrollFn($(this).attr('href'), function(hash) {
            highlightItem(hash);
            location.hash = hash;
        });
        return false;
    });
    
    // 滚动条滚动响应
    $(document).scroll(function() {
        var top = $(this).scrollTop();
        $('.modual>h2').each(function(i, item) {
            var node = $(item);
            if (node.offset().top >= top) {
                highlightItem('#' + node.text().replace(/\./g, '_'));
                return false;
            }
        });
    });
    
    // 进入页面时候如果有hash则滚动至该处
    scrollFn(location.hash);
    highlightItem(location.hash);
});
