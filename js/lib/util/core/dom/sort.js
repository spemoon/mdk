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
            var w = node.width();
            var h = node.height();
            var pTop = o.top;
            var pLeft = o.left;
            var pHTop = pTop + h / 2;
            var pHLeft = pLeft + w / 2;
            var pBottom = pTop + h;
            var pRight = pLeft + w;

            var t = target.offset();
            var top = t.top;
            var left = t.left;
            var bottom = top + target.height();
            var right = left + target.width();

            return ((top > pTop && top < pHTop) || (bottom < pBottom && bottom > pHTop)) && ((left > pLeft && left < pHLeft) || (right < pRight && right > pHLeft));
        }
    };

    var r = {
        reg: function(params) {
            array.forEach(function(item, index, items) {
                var $item = $(item);
                var connectItems = [];
                drag.reg({
                    node: $item,
                    handle: params.handle,
                    proxy: true,
                    keepPosition: true,
                    beforeDrag: function(e, handle, node) {
                        var flag = true;
                        items = helper.items(params.node, params.item, params.filter); // 更新sort中的元素集合
                        index = helper.index(node, items); // 拖拽前的单前元素所在的位置
                        if(params.connect) {
                            params.connect.each(function(i, v) {
                                connectItems[i] = helper.items($(v), params.connectItem || params.item, params.filter);
                            });
                        }
                        if(lang.isFunction(params.filter)) {
                            flag = !!params.filter(node, index, items);
                        }
                        return flag;
                    },
                    drag: function(e, handle, node, targetNode) {
                        var flag = false;
                        (function() {
                            for(var i = 0, len = items.length; i < len; i++) {
                                if(i != index) {
                                    var item = $(items[i]);
                                    if(helper.hover(item, targetNode)) {
                                        if(i > index) {
                                            item.after(node);
                                        } else {
                                            item.before(node);
                                        }
                                        items.splice(i, 0, items.splice(index, 1)[0]);
                                        index = i;
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                        })();
                        (function() {
                            for(var i = 0, len = connectItems.length; i < len; i++) {
                                for(var j = 0, jLen = connectItems[i].length; j < jLen; j++) {
                                    var item = $(connectItems[i][j]);
                                    if(helper.hover(item, targetNode)) {
                                        item.after(node);
                                        connectItems[i].splice(i, 0, items.splice(index, 1)[0]);
                                        index = i;
                                        return;
                                    }
                                }
                            }
                        })();
                    }
                });
            }, helper.items(params.node, params.item));
        }
    };
    return r;
});