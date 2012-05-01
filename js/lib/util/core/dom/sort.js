define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var drag = require('./drag.js');

    var r = {
        reg: function(params) {
            var items = params.node.children(params.item);
            drag.reg({
                node: items,
                proxy: true,
                keepPosition: true
            });
        }
    };
    return r;
});