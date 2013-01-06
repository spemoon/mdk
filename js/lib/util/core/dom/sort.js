define(function (require, exports, module) {
    var $ = require('jquery');
    var lang = require('../lang');
    var array = require('../array');
    var drag = require('./drag');

    var helper = {
        filter:function (items, filter) {
            return items.filter(function (i) {
                return filter(items.eq(i), i, items) !== false;
            });
        },
        items:function (node, item, filter) {
            var items = node.children(item || '');
            if (lang.isFunction(filter)) {
                items = helper.filter(items, filter);
            }
            return items.toArray();
        },
        index:function (node, list) {
            var index = -1;
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i] === node[0]) {
                    index = i;
                    break;
                }
            }
            return index;
        },
        hover:function (node, target) {
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
            if (flag) {
                if (top > pTop && top < pHTop) {
                    result = 'before';
                } else if (bottom < pBottom && bottom > pHTop) {
                    result = 'after';
                }
            }
            return result;
        }
    };

    var r = {
        reg:function (params) {
            var event = $({});
            params.node.data('config', params);
            array.forEach(function (item, index, items) {
                var $item = $(item); // 被拖拽节点
                var placeholder;
                var connectTo; // 被拖拽到其他容器
                var connectItems;
                var config = params;
                var prevContainer; // 上一次进入的容器
                var endIndex; // 拖拽结束后所处容器的位置index

                var d = drag.reg({
                    node:$item,
                    handle:config.handle,
                    beforeDrag:function (e, handle, node) {
                        var flag = lang.callback(params.beforeDrag, {
                            scope:handle,
                            params:[e, handle, node]
                        });
                        if (flag) {
                            connectTo = false;
                            connectItems = [];
                            if (lang.isFunction(config.filter)) {
                                flag = !!config.filter(node, index, items);
                            }
                            if (flag) {
                                items = helper.items(config.node, config.item, config.filter); // 更新sort中的元素集合
                                index = helper.index(node, items); // 拖拽前的单前元素所在的位置
                                if (config.connect) {
                                    config.connect.each(function (i, v) {
                                        connectItems[i] = helper.items($(v), config.connectItem || config.item, config.connectFilter);
                                    });
                                }
                                placeholder = node.clone().empty().css({
                                    visibility:'hidden'
                                });
                                node.after(placeholder);
                            }
                        }
                        return flag;
                    }
                });
                d.event.bind({
                    dragstart:function (e, mouse, handle, node, target, position) {
                        event.trigger('dragstart', [placeholder, mouse, handle, node, target, position]);
                    },
                    drag:function (e, mouse, handle, node, target, position) {
                        var flag = false;
                        (function () {
                            if (helper.hover(config.node, target)) {
                                prevContainer = config.node;
                                for (var i = 0, len = items.length; i < len; i++) {
                                    if (i != index) {
                                        var item = $(items[i]);
                                        var position = helper.hover(item, target);
                                        if (position) {
                                            item[position](placeholder);
                                            items.splice(i, 0, items.splice(index, 1)[0]);
                                            event.trigger('placeholder', [placeholder, config.node, i, index, mouse, handle, node, target, position]);
                                            index = i;
                                            endIndex = i;
                                            flag = true;
                                            connectTo = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        })();
                        if (!flag) {
                            if (config.connect) {
                                config.connect.each(function (i, v) {
                                    var $v = $(v);
                                    if (helper.hover($v, target)) {
                                        prevContainer = $v;
                                        if (connectItems[i].length == 0) { // 无元素情况
                                            $v.append(placeholder);
                                            connectTo = $v;
                                            event.trigger('placeholder', [placeholder, $v, i, index, mouse, handle, node, target, position]);
                                            return false;
                                        } else {
                                            for (var j = 0, len = connectItems[i].length; j < len; j++) {
                                                var item = $(connectItems[i][j]);
                                                var position = helper.hover(item, target);
                                                if (position) {
                                                    item[position](placeholder);
                                                    connectTo = $v;
                                                    endIndex = i;
                                                    event.trigger('placeholder', [placeholder, $v, i, index, mouse, handle, node, target, position]);
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    },
                    dragend:function (e, mouse, handle, node, position) {
                        placeholder.replaceWith(node);
                        node.css('position', position.position);
                        placeholder = null;
                        if (connectTo) {
                            config = connectTo.data('config');
                            connectTo = false;
                        }
                        event.trigger('dragend', [prevContainer, endIndex, mouse, handle, node, position]);
                        prevContainer = null;
                    }
                });
            }, helper.items(params.node, params.item));
            return event;
        }
    };
    return r;
});