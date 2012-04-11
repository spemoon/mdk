define(function(require, exports, module) {
    var $ = require('../../../jquery/1.7.1/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var mVar = require('./mVar.js');

    var dragId = mVar.id();
    var doc = $(document);
    var win = $(window);
    var cache = {
        node:[],
        status:0 // 0: 初始或者mouseup时无拖拽，1: mousedown准备拖拽，2: 正在mousemove拖拽
    };
    var helper = {
    };
    var r = {
        /**
         * @param handle 拖拽句柄
         * @param params
         *        node: 被拖动节点
         *
         */
        reg:function(handle, params) {
            params = params || {};
            var handle = $(handle);
            var node = params.node ? $(params.node) : handle;
            if(params.except) { // 拖拽句柄排除
                params.except.css('cursor', 'default').mousedown(function(e) {
                    return false;
                });
            }
            handle.css('cursor', 'move').mousedown(function(e) {
                if(e.which == 1) { // 限制左键拖动
                    var zIndex = mVar.zIndex(); // 最高z-index
                    var random = +new Date(); // 时间戳用来做事件命名空间
                    var mouseX = e.pageX, mouseY = e.pageY;
                    var minX, minY, maxX, maxY;
                    var nodeOffset = node.offset();
                    var startX = nodeOffset.left;
                    var startY = nodeOffset.top;
                    var nodeWidth = node.outerWidth();
                    var nodeHeight = node.outerHeight();
                    var container = $(params.container);
                    var containerWidth = container.width();
                    var containerHeight = container.height();
                    var proxy, target;
                    var action = {
                        start:function(e) {
                            cache.status = 1;
                            if(params.proxy) { // 代理容器节点生成
                                proxy = $('#' + dragId);
                                if(!proxy[0]) {
                                    $(document.body).append('<div style="position:absolute;display: none;" id="' + dragId + '"></div>');
                                    proxy = $('#' + dragId);
                                }
                                proxy.css({
                                    top:nodeOffset.top,
                                    left:nodeOffset.left,
                                    display:'block',
                                    zIndex:zIndex
                                });
                                if(params.dashed) {
                                    proxy.css({
                                        width:node.width(),
                                        height:node.height(),
                                        border:'1px dashed #ddd'
                                    });
                                } else {
                                    proxy.append(node.clone().css({
                                        top:0,
                                        left:0
                                    }));
                                    node.css('visibility', 'hidden');
                                }
                                target = proxy;
                            } else { // 非代理模式情况下将节点处理成absolute
                                var position = node.css('position');
                                node.css({
                                    position:'absolute',
                                    left:startX,
                                    top:startY,
                                    zIndex:zIndex,
                                    outline:'none'
                                }).attr('tabindex', '1').attr('hidefocus', 'true').focus();
                                target = node;
                            }
                            if(lang.isFunction(params.multi)) {
                                cache.node = params.multi();
                            } else {
                                cache.node = [node];
                            }
                            handle.bind('losecapture.' + random, action.end);
                            win.bind('blur.' + random, action.end); // 失去焦点时候触发mouseup，防止拖拽过程光标被其他程序抢夺后导致回到界面鼠标其实处于mouseup状态却可以拖拽);
                            if(handle[0].setCapture) {
                                handle[0].setCapture();
                            }
                            if(params.scroll !== true) { // 拖动时候不影响滚动条，设置true则可以在拖动到边缘的同时让滚动条滚动
                                e.preventDefault();
                            }
                        },
                        drag:function(e) {
                            if(cache.status == 1 || cache.status == 2) {
                                if(cache.status == 1) {
                                    cache.status = 2;
                                }
                                if(container[0]) {
                                    var containerOffset = container.offset();
                                    minX = containerOffset.left;
                                    maxX = minX + containerWidth - nodeWidth;
                                    minY = containerOffset.top;
                                    maxY = minY + containerHeight - nodeHeight;
                                } else {
                                    minX = doc.scrollLeft();
                                    maxX = minX + win.width() - nodeWidth;
                                    minY = doc.scrollTop();
                                    maxY = minY + win.height() - nodeHeight;
                                }
                                if(params.axisX) {
                                    minY = maxY = nodeOffset.top;
                                }
                                if(params.axisY) {
                                    minX = maxX = nodeOffset.left;
                                }
                                target.css({
                                    left:Math.min(Math.max(e.pageX - mouseX + startX, minX), maxX),
                                    top:Math.min(Math.max(e.pageY - mouseY + startY, minY), maxY)
                                });
                            }
                        },
                        end:function(e) {
                            var target = params.proxy ? proxy : node;
                            var offset = target.offset();
                            cache.status = 0;
                            if(params.proxy) {
                                node.css({
                                    top:offset.top,
                                    left:offset.left,
                                    position:'absolute',
                                    visibility:'visible',
                                    zIndex:zIndex
                                });
                                proxy.css({
                                    display:'none',
                                    border:0,
                                    width:'auto',
                                    height:'auto'
                                }).html('');
                            }
                            if(lang.callback(params.drop)) {
                                lang.callback(params.after);
                            }
                            if(handle[0].releaseCapture) {
                                handle[0].releaseCapture();
                            }
                            doc.unbind('mousemove.' + random).unbind('mouseup.' + random);
                            handle.unbind('losecapture.' + random)
                            win.unbind('blur.' + random);
                        }
                    };
                    action.start(e);
                    doc.bind('mousemove.' + random, action.drag).bind('mouseup.' + random, action.end);
                }
            });
        }
    };
    return r;
});
