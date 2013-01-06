define(function(require, exports, module) {
    var $ = require('jquery');

    var helper = {
        detect: (function() {
            var isSupport = 0;
            return function() {
                if(isSupport === 0) {
                    isSupport = 'placeholder' in document.createElement('input');
                }
                return isSupport;
            };
        })()
    };

    var r = {
        reg: function(node, placeholder, form) {
            if(!placeholder) {
                placeholder = node.attr('placeholder') || '';
            }
            if(placeholder) {
                if(!helper.detect()) { // 不支持原生placeholder
                    node.bind({
                        focus: function(e) {
                            if(node.val() == placeholder) { // 值是placeholder则置空
                                node.val('');
                            }
                        },
                        blur: function(e) {
                            if($.trim(node.val()) == '') { // 没输入内容重置为placeholder
                                node.val(placeholder);
                            }
                        }
                    });
                    if($.trim(node.val()) == '') { // 初始化placeholder
                        node.val(placeholder);
                    }
                }
            }
            // 返回值：用于表单提交时候模拟的placeholder需要置为空，可以用这个来判断
            return function() {
                return node.val() == placeholder;
            };
        }
    };

    return r;
});