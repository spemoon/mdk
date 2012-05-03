define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var array = require('../array.js');
    var drag = require('./drag.js');

    var r = {
        reg: function(params) {
            var items = params.node.children(params.item);
            drag.reg({
                node: items,
                proxy: true,
                keepPosition: true,
                drag: function(e, handle, node, params) {
                    var index = (function(items) {
                        for(var i = 0, len = items.length; i < len; i++) {
                            if(items.eq(i)[0] === node[0]) {
                                return i;
                            }
                        }
                    })(items);
                    (function(items) {
                        for(var i = 0, len = items.length; i < len; i++) {
                            if(i != index) {
                                var n = items.eq(i);
                                var o = n.offset();
                                var w = n.width();
                                var h = n.height();
                                if((e.pageX >= o.left + w / 2) && (e.pageX < o.left + w) && (e.pageY >= o.top)) {
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