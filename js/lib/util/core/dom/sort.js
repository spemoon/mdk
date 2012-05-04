define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var drag = require('./drag.js');

    var helper = {
        getItems: function(node, item, filter) {

        }
    };

    var r = {
        reg: function(params) {
            drag.reg({
                node: params.node.children(params.item),
                handle: params.handle,
                proxy: true,
                keepPosition: true,
                drag: function(e, handle, node, targetNode) {
                    var items = params.node.children(params.item);
                    if(lang.isFunction(params.filter)) {
                        items = items.filter(function(i) {
                            var result = params.filter(items.eq(i), i, items, params.node);
                            if(!result) {
                                drag.unreg(items.eq(i));
                            }
                            return result;
                        });
                    }
                    var index = (function(items) {
                        for(var i = 0, len = items.length - 1; i < len; i++) {
                            if(items.eq(i)[0] === node[0]) {
                                return i;
                            }
                        }
                        return -1;
                    })(items);
                    (function(items) {
                        for(var i = 0, len = items.length - 1; i < len; i++) {
                            if(i != index) {
                                var n = items.eq(i);
                                var o = n.offset();
                                var w = n.width();
                                var h = n.height();
                                var pTop = o.top;
                                var pLeft = o.left;
                                var pHTop = pTop + h/2;
                                var pHLeft = pLeft + w/2;
                                var pBottom = pTop + h;
                                var pRight = pLeft + w;

                                var t = targetNode.offset();
                                var top = t.top;
                                var left = t.left;
                                var bottom = top + targetNode.height();
                                var right = left + targetNode.width();

                                if(((top > pTop && top < pHTop) || (bottom < pBottom && bottom > pHTop)) && ((left > pLeft && left < pHLeft) || (right < pRight && right > pHLeft))) {
                                    if(i > index) {
                                        n.after(node);
                                    } else {
                                        n.before(node);
                                    }
                                    break;
                                }
                            }
                        }
                    })(items);
                }
            });
        }
    };
    return r;
});