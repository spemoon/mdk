define(function(require, exports, module) {
    var helper = {
        addEventListener: function(node, type, action) {
            node.addEventListener(type, function(e) {
                var files = e.target.files || e.dataTransfer.files;
                action && action(e, files);
                e.stopPropagation();
                e.preventDefault();
            }, false);
        }
    };

    /**
     * HTML5 上传
     * 对接受容器加入dragenter,dragover, dragleave, drop 事件
     * @param params
     */
    var dragUpload = {
        bind: function(params) {
            params = params || {};
            var node = params.node || document.body;

            helper.addEventListener(node, 'dragenter', params.dragenter);
            helper.addEventListener(node, 'dragover', params.dragover);
            helper.addEventListener(node, 'dragleave', params.dragleave);
            helper.addEventListener(node, 'drop', params.drop);
        },
        unbind: function(node) {
            node.removeEventListener('dragenter');
            node.removeEventListener('dragover');
            node.removeEventListener('dragleave');
            node.removeEventListener('drop');
        }
    };
    return dragUpload;
});