define(function(require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../../../../js/lib/util/core/lang.js');
    var ajax = require('../../../../../js/lib/util/core/ajax.js');
    var action = require('../../../../../js/lib/util/core/dom/action.js');
    var inputx = require('../../../../../js/lib/util/core/dom/input.js');
    var mVar = require('../../../../../js/lib/util/core/dom/mVar.js');
    // var xxx = require('../../../../../js/');

    var helper = {
        getIndex: function(list, cls) {
            var index = -1;
            for(var i = 0, len = list.length; i < len; i++) {
                var item = list[i] || list.eq(i);
                if($(item).hasClass(cls)) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    };

    var r = {
        reg: function(node, params) {
            var xhr = ajax.single(mVar.id());
            var container = $(params.container); // 承载容器
            var highlight = params.highlight || 'hover'; // 高亮样式
            var keyword = params.keyword || 'keyword';
            var loadingFn = function(container) { // 生成视图前的提示
                if(lang.isFunction(params.loading)) {
                    params.loading.call(node, container);
                }
            };
            var errorFn = function(container, data) { // 生成视图前的提示
                if(lang.isFunction(params.error)) {
                    params.error.call(node, container, data);
                } else {
                    container.html('<div class="error">' + ((data && data.msg) || '载入失败') + '</div>');
                }
            };
            var buildFn = function(container, data) {
                if(lang.isFunction(params.build)) {
                    params.build.call(node, container, data);
                    container.find(params.list).hover(function(e) {
                        if(!$(this).hasClass(highlight)) {
                            container.find('.' + highlight).removeClass(highlight);
                            $(this).addClass(highlight);
                        }
                    });
                }
            };
            var searchFn = function(keyword) {
                if(lang.isFunction(params.searchFn)) {
                    params.searchFn.call(node, container, data);
                }
            };
            var timer; // 定时器防止输入太快服务器响应也很快导致请求数过多
            var preVal; // 上一次输入框内容
            node = $(node);
            params = params || {};
            inputx.reg(node, function(val, lastInput, rangeData) {
                val = $.trim(node.val());
                if(preVal === val) { // 和上次相同的值
                    if(container.is(':hidden')) {
                        container.show();
                    }
                } else {
                    preVal = val;
                    if(val.length) {
                        if(params.url) { // 远程数据源模式
                            var url = lang.isFunction(params.url) ? params.url(node, params) : params.url;
                            url += url.indexOf('?') == -1 ? '?' : '&';
                            url += keyword + '=' + val;
                            clearTimeout(timer);
                            container.show();
                            timer = setTimeout(function() {
                                xhr.send({
                                    url: url,
                                    before: function() {
                                        loadingFn(container);
                                    },
                                    error: function(xhr, status) {
                                        errorFn(container);
                                    },
                                    failure: function(data) {
                                        errorFn(container, data);
                                    },
                                    success: function(data) {
                                        buildFn(container, data);
                                    }
                                });
                            }, 256);
                        } else if(params.data) { // 本地数据源模式
                            buildFn(container, data);
                        }
                    } else { // 空输入
                        lang.callback(params.empty, {
                            scope: node
                        });
                    }
                }
            });

            action.listen(params.events, container); // 监听一些事件

            var index;
            node.bind({
                keydown: function(e) {
                    var keyCode = e.keyCode;
                    if(keyCode == 38 || keyCode == 40) {
                        var list = container.find(params.list);
                        index = helper.getIndex(list, highlight);
                        if(keyCode == 38) { // up
                            if(index == -1) {
                                index = list.length - 1;
                            } else {
                                index--;
                            }
                        } else if(keyCode == 40) { // down
                            if(index == -1) {
                                index = 0;
                            } else if(index == list.length - 1) {
                                index = -1;
                            } else {
                                index++;
                            }
                        }
                        container.find('.' + highlight).removeClass(highlight);
                        if(index != -1) {
                            list.eq(index).addClass(highlight);
                        }
                    } else if(keyCode == 13) { // 回车选择
                        var item = container.find('.' + highlight).eq(0);
                        if(item[0]) {
                            lang.callback(params.select, {
                                scope: node,
                                params: [item]
                            });
                            container.hide();
                        }
                    }
                },
                blur: function(e) {
                    setTimeout(function() {
                        container.hide();
                    }, 512);
                }
            });

            container.bind({
                click: function(e) {
                    var target = $(e.target);
                    if(!target.attr('data-action')) {
                        var item = target.hasClass(params.list) ? target : target.parents(params.list).eq(0);
                        console.log(item);
                        lang.callback(params.select, {
                            scope: node,
                            params: [item]
                        });
                        container.hide();
                        return false;
                    }
                }
            });
        }
    };

    return r;
});