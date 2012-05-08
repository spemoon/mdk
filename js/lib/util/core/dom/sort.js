define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var drag = require('./drag.js');

    var helper = {
        filter: function(items, filter) {
            return items.filter(function(i) {
                return filter(items.eq(i), i, items) !== false;
            });
        },
        items: function(node, item, filter) {
            var items = node.children(item || '');
            if(lang.isFunction(filter)) {
                items = helper.filter(items, filter);
            }
            return items.toArray();
        },
        index: function(node, list) {
            var index = -1;
            for(var i = 0, len = list.length; i < len; i++) {
                if(list[i] === node[0]) {
                    index = i;
                    break;
                }
            }
            return index;
        },
        hover: function(node, target) {
            var o = node.offset();
            var w = node.outerWidth();
            var h = node.outerHeight();
            var pTop = o.top;
            var pLeft = o.left;
            var pHTop = pTop + h / 2;
            var pHLeft = pLeft + w / 2;
            var pBottom = pTop + h;
            var pRight = pLeft + w;

            var t = target.offset();
            var top = t.top;
            var left = t.left;
            var bottom = top + target.outerHeight();
            var right = left + target.outerWidth();

            var result = false;
            var flag = (left > pLeft && left < pHLeft) || (right < pRight && right > pHLeft);
            if(flag) {
                if(top > pTop && top < pHTop) {
                    result = 'before';
                } else if(bottom < pBottom && bottom > pHTop) {
                    result = 'after';
                }
            }
            return result;
        }
    };

    var r = {
        reg: function(params) {
            params.node.data('config', params);
            array.forEach(function(item, index, items) {
                var $item = $(item); // 被拖拽节点
                var placeholder;
                var connectTo; // 被拖拽到其他容器
                var connectItems;
                var config = params;

                drag.reg({
                    node: $item,
                    handle: config.handle,
                    beforeDrag: function(e, handle, node) {
                        var flag = true;
                        connectTo = false;
                        connectItems = [];
                        if(lang.isFunction(config.filter)) {
                            flag = !!config.filter(node, index, items);
                        }
                        if(flag) {
                            items = helper.items(config.node, config.item, config.filter); // 更新sort中的元素集合
                            index = helper.index(node, items); // 拖拽前的单前元素所在的位置
                            if(config.connect) {
                                config.connect.each(function(i, v) {
                                    connectItems[i] = helper.items($(v), config.connectItem || config.item, config.connectFilter);
                                });
                            }
                            placeholder = node.clone().css({
                                visibility: 'hidden'
                            });
                            node.after(placeholder);
                        }
                        return flag;
                    },
                    drag: function(e, handle, node, targetNode) {
                        var flag = false;
                        (function() {
                            if(helper.hover(config.node, targetNode)) {
                                for(var i = 0, len = items.length; i < len; i++) {
                                    if(i != index) {
                                        var item = $(items[i]);
                                        var position = helper.hover(item, targetNode);
                                        if(position) {
                                            item[position](placeholder);
                                            items.splice(i, 0, items.splice(index, 1)[0]);
                                            index = i;
                                            flag = true;
                                            connectTo = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        })();
                        if(!flag) {
                            if(config.connect) {
                                config.connect.each(function(i, v) {
                                    var $v = $(v);
                                    if(helper.hover($v, targetNode)) {
                                        if(connectItems[i].length == 0) { // 无元素情况
                                            $v.append(placeholder);
                                            connectTo = $v;
                                            return false;
                                        } else {
                                            for(var j = 0, len = connectItems[i].length; j < len; j++) {
                                                var item = $(connectItems[i][j]);
                                                var position = helper.hover(item, targetNode);
                                                if(position) {
                                                    item[position](placeholder);
                                                    connectTo = $v;
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    },
                    dragend: function(e, handle, node, position) {
                        placeholder.replaceWith(node);
                        node.css('position', position.position);
                        placeholder = null;
                        if(connectTo) {
                            config = connectTo.data('config');
                            connectTo = false;
                        }
                    }
                });
            }, helper.items(params.node, params.item));
        }
    };
    return r;
});