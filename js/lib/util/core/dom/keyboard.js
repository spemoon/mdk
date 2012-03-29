define(function(require, exports, module) {
    var $ = require('../../../jquery/1.7.1/sea_jquery.js');

    var r = {
        ESC:27,
        LEFT:37,
        UP:38,
        RIGHT:39,
        DOWN:40,
        ENTER:13,
        number:function(keyCode) {
            return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
        },
        char:function(keyCode) {
            return keyCode >= 65 && keyCode <= 90;
        },
        ctrlEnter:function(node, callback) {
            return node.keydown(function(e) {
                if(e.ctrlKey && e.keyCode == r.ENTER) {
                    callback.call(node, e);
                    e.stopPropagation();
                }
            });
        }
    };
    return r;
});
