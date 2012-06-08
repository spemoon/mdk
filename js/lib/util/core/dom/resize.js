define(function(require, exports, module) {
    var $ = require('../../../jquery/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var mVar = require('./mVar.js');

    var DIRS = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    var doc = $(document);
    var win = $(window);
    var status = 0; // 0: 初始或者mouseup时无resize，1: mousedown准备resize，2: 正在mousemove resize
    var eventSpace = +new Date();
    var helper = {
        style: function(type, val, node) {
            if(!lang.isUndefined(val)) {
                node[0].style[type] = val + 'px';
            }
        },
        resize: function(params) {
            var isProxy = params.isProxy;
            var x = params.event.pageX;
            var y = params.event.pageY;
            var dir = params.dir;
            var maxHeight = params.maxHeight;
            var maxWidth = params.maxWidth;
            var minHeight = params.minHeight;
            var minWidth = params.minWidth;
            var scroll = params.scroll;
            var marginTop = params.marginTop;
            var marginBottom = params.marginBottom;
            var marginLeft = params.marginLeft;
            var marginRight = params.marginRight;
            var paddingRight = params.paddingRight;
            var paddingBottom = params.paddingBottom;
            var paddingRightCopy = 0;
            var paddingBottomCopy = 0;
            var node = params.node;
            var sizeNode = params.sizeNode;
            var position = params.position;
            if(isProxy) {
                paddingRightCopy = paddingRight;
                paddingBottomCopy = paddingBottom;
                paddingBottom = 0;
                paddingRight = 0;
            }

            var top, left, width, height;
            if(dir.indexOf('n') != -1) { // north,处理top和height
                top = Math.min(Math.max(scroll ? 0 : doc.scrollTop(), position.y + position.height - maxHeight, y), position.y + position.height - minHeight);
                height = position.y - top + position.height + paddingBottomCopy;
            }
            if(dir.indexOf('e') != -1) { // east,处理width
                width = Math.min(maxWidth, Math.max(minWidth, Math.max(Math.min((scroll ? doc.width() : doc.scrollLeft() + win.width()) - marginLeft - marginRight, x), position.x + minWidth + paddingRightCopy) - position.x - paddingRight));
            }
            if(dir.indexOf('s') != -1) { // south,处理height
                height = Math.min(maxHeight, Math.max(minHeight, Math.max(Math.min((scroll ? doc.height() : doc.scrollTop() + win.height()) - marginTop - marginBottom, y), position.y + minHeight + paddingBottomCopy) - position.y - paddingBottom));
            }
            if(dir.indexOf('w') != -1) { // west,处理left和width
                left = Math.min(Math.max((scroll ? 0 : doc.scrollLeft()), position.x + position.width - maxWidth, x), position.x + position.width - minWidth);
                width = position.x - left + position.width + paddingRightCopy;
            }
            helper.style('top', top, node);
            helper.style('left', left, node);
            helper.style('height', height, sizeNode);
            helper.style('width', width, sizeNode);
            return {
                top: top,
                left: left,
                height: height,
                width: width
            }
        }
    };
    var r = {
        reg: function(params) {
            var node = params.node;
            var sizeNode = params.sizeNode || node;
            var isProxy = !!params.proxy;
            var paddingRight = params.paddingRight || 0;
            var paddingBottom = params.paddingBottom || 0;
            var minHeight = params.minHeight || 30;
            var minWidth = params.minWidth || 30;
            var maxHeight;
            var maxWidth;
            var event = $({}); // 用来绑定事件
            var handles = {};
            var marginTop, marginBottom, marginLeft, marginRight;

            var scroll = params.scroll === true;
            if(sizeNode.height() < minHeight) {
                sizeNode.height(minHeight);
            }
            if(sizeNode.width() < minWidth) {
                sizeNode.width(minWidth);
            }

            if(node[0].tagName.toUpperCase() == 'TEXTAREA') {
                params.type = 'textarea';
                params.keepPosition = true;
                if(!params.dir && !params.all) {
                    params.dir = {
                        se: true
                    };
                }
                (function() { // wrap textarea,直接使用wrap方法会无法插入resize节点
                    var wrap = $('<div></div>').css({
                        position: 'relative',
                        width: sizeNode.outerWidth(),
                        height: sizeNode.outerHeight()
                    });
                    var clone = node.clone(true);
                    node.before(wrap);
                    wrap.append(clone);
                    node.remove();
                    node = wrap;
                    sizeNode = clone;
                })();
            }
            params.dir = params.dir || {};
            if(params.all === true) {
                (function() {
                    array.forEach(function(v, i, arr) {
                        params.dir[v] = true;
                    }, DIRS);
                })();
            }
            (function(dir) {
                var anchor;
                for(var key in dir) {
                    if(dir[key] === true) { // 自动生成节点
                        anchor = $('<span class="resize-anchor resize-' + key + '"></span>');
                        node.append(anchor);
                    } else {
                        if(typeof dir[key] == 'string') {
                            anchor = $(dir[key]);
                        } else { // jquery node
                            anchor = dir[key];
                        }
                    }
                    anchor.css('cursor', key + '-' + 'resize');
                    handles[key] = anchor;
                }
            })(params.dir);
            (function() {
                for(var key in handles) {
                    (function(dir, handle) {
                        if(!handle.data('resizable')) {
                            handle.data('resizable', true).bind('mousedown.' + eventSpace, function(e) {
                                var targetNode = node; // 当前被resize的节点，非proxy时是node，proxy时是代理节点
                                var targetSizeNode = sizeNode;
                                var result;
                                var scope = $(this); // handle
                                maxHeight = params.maxHeight || win.height();
                                maxWidth = params.maxWidth || win.width();
                                if(e.which == 1) { // 限制左键拖动
                                    var random = +new Date(); // 时间戳用来做事件命名空间
                                    var mouseX = e.pageX, mouseY = e.pageY;
                                    var startPosition = {
                                    };
                                    var proxy;
                                    var action = {
                                        start: function(e) {
                                            status = 1;
                                            if(isProxy) { // 代理容器节点生成
                                                (function() {
                                                    proxy = $('<div/>').addClass('resize-proxy').css({
                                                        width: node.width(),
                                                        height: node.height(),
                                                        top: node.css('top'),
                                                        left: node.css('left')
                                                    });
                                                    if(params.hide === true) {
                                                        node.css('visibility', 'hidden');
                                                    }
                                                    node.parent().append(proxy);
                                                    targetNode = proxy;
                                                    targetSizeNode = proxy;
                                                })();
                                            }
                                            (function() {
                                                var offset = node.offset();
                                                startPosition.x = offset.left;
                                                startPosition.y = offset.top;
                                                startPosition.width = sizeNode.width();
                                                startPosition.height = sizeNode.height();
                                                startPosition.position = node.css('position');
                                                if(startPosition.position == 'static' || !startPosition.position) {
                                                    startPosition.position = 'relative';
                                                    node.css('position', startPosition.position);
                                                }
                                            })();
                                            if(!isProxy) { //
                                                if(params.keepPosition === true) { // 保持住position，适合下/右以及右下角resize的情况，其他情况情况并不适用
                                                    node.css('outline', 'none');
                                                } else {
                                                    node.css({
                                                        position: 'absolute',
                                                        left: startPosition.x,
                                                        top: startPosition.y,
                                                        outline: 'none'
                                                    });
                                                }
                                                node.attr('tabindex', '1').attr('hidefocus', 'true').focus();
                                            }
                                            marginTop = (params.marginTop || 0) + parseFloat(targetNode.css('border-top-width'));
                                            marginBottom = (params.marginBottom || 0) + parseFloat(targetNode.css('border-bottom-width'));
                                            marginLeft = (params.marginLeft || 0) + parseFloat(targetNode.css('border-left-width'));
                                            marginRight = (params.marginRight || 0) + parseFloat(targetNode.css('border-right-width'));
                                            win.bind('blur.' + random, action.end); // 失去焦点时候触发mouseup，防止resize过程光标被其他程序抢夺后导致回到界面鼠标其实处于mouseup状态却可以resize);
                                            if(scope[0].setCapture) {
                                                scope[0].setCapture();
                                                scope.bind('losecapture.' + random, action.end);
                                            }
                                            if(params.scroll !== true) { // 拖动时候不影响滚动条，设置true则可以在拖动到边缘的同时让滚动条滚动
                                                e.preventDefault();
                                            }
                                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                            event.trigger('start', [e, scope, node, targetNode, targetSizeNode, startPosition]);
                                        },
                                        drag: function(e) {
                                            if(status == 1 || status == 2) {
                                                var obj = {
                                                    event: e,
                                                    dir: dir,
                                                    node: targetNode,
                                                    sizeNode: targetSizeNode,
                                                    position: startPosition,
                                                    minHeight: minHeight,
                                                    minWidth: minWidth,
                                                    maxHeight: maxHeight,
                                                    maxWidth: maxWidth,
                                                    marginTop: marginTop,
                                                    marginBottom: marginBottom,
                                                    marginLeft: marginLeft,
                                                    marginRight: marginRight,
                                                    paddingBottom: paddingBottom,
                                                    paddingRight: paddingRight,
                                                    scroll: scroll,
                                                    isProxy: isProxy,
                                                    params: params
                                                };
                                                if(status == 1) {
                                                    status = 2;
                                                }
                                                result = helper.resize(obj);
                                                if(scroll) { // 拖动支持滚动条响应时候要清除文本选择（滚动条的运动应该就是文本选择导致的，设置禁止选择文本滚动条则不会响应resize）
                                                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                                }
                                                if(params.type == 'textarea') {
                                                    helper.style('width', targetSizeNode.outerWidth(), targetNode);
                                                    helper.style('height', targetSizeNode.outerHeight(), targetNode);
                                                }
                                                event.trigger('resize', [e, result, obj]); //
                                            }
                                        },
                                        end: function(e) {
                                            status = 0;
                                            if(isProxy) {
                                                if(result) {
                                                    helper.style('top', result.top, node);
                                                    helper.style('left', result.left, node);
                                                    helper.style('width', result.width - paddingRight, sizeNode);
                                                    helper.style('height', result.height - paddingBottom, sizeNode);
                                                }
                                                proxy.remove();
                                            }
                                            event.trigger('end', [e, scope, node, startPosition]);
                                            if(scope[0].releaseCapture) {
                                                scope[0].releaseCapture();
                                            }
                                            result = null;
                                            doc.unbind('mousemove.' + random).unbind('mouseup.' + random);
                                            scope.unbind('losecapture.' + random);
                                            win.unbind('blur.' + random);
                                        }
                                    };
                                    if(lang.callback(params.beforeResize, {
                                        scope: scope,
                                        params: [e, scope, node]
                                    })) {
                                        action.start(e);
                                        handle.data('resizable', true);
                                        doc.bind('mousemove.' + random, action.drag).bind('mouseup.' + random, action.end);
                                    } else {
                                        handle.css('cursor', 'default').removeData('resizable');
                                    }
                                }
                            });

                        }
                    })(key, handles[key]);
                }
            })();
            return event;
        },
        unreg: function(node, handle) {
            (handle ? node.find(handle) : node).css('cursor', 'default').removeData('resizable').unbind('mousedown.' + eventSpace);
        }
    };
    return r;
});
