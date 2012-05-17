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
        size: function(val, min, max) {
            if(typeof max != 'undefined') {
                val = Math.min(val, max);
            }
            val = Math.max(val, min || 0);
            return val;
        },
        resize: function(e, dir, node, startPosition, params) {
            var x = e.pageX;
            var y = e.pageY;
            var top, left, width, height;
            var css = {};
            if(dir.indexOf('n') != -1) {
                css.top = Math.min(Math.max(params.scroll === true ? 0 : doc.scrollTop(), y), startPosition.y + startPosition.height);
                css.height = helper.size(startPosition.y - css.top + startPosition.height, params.minHeight, params.maxHeight);
            }
            if(dir.indexOf('e') != -1) {
                x = Math.min(x, params.scroll === true ? doc.scrollLeft() + win.width() : doc.width());
                css.width = helper.size(x - startPosition.x, params.minWidth, params.maxWidth);
            }
            if(dir.indexOf('s') != -1) {
                y = Math.min(y, params.scroll === true ? doc.scrollTop() + win.height() : doc.height());
                css.height = helper.size(y - startPosition.y, params.minHeight, params.maxHeight);
            }
            if(dir.indexOf('w') != -1) {
                css.left = Math.min(Math.max(params.scroll === true ? 0 : doc.scrollLeft(), x), startPosition.x + startPosition.width);
                css.width = helper.size(startPosition.x - css.left + startPosition.width, params.minWidth, params.maxWidth);
            }
            console.log(css);
            node.css(css);
        }
    };
    var r = {
        reg: function(params) {
            var node = lang.isFunction(params.node) ? params.node() : params.node;
            var event = $({}); // 用来绑定事件
            var handles = {};
            if(node[0].tagName.toUpperCase() == 'TEXTAREA') {
                (function() {
                    var wrap = $('<div></div>').css({
                        position: 'relative',
                        width: node.width(),
                        height: node.height()
                    });
                    var clone = node.clone(true);
                    node.before(wrap);
                    wrap.append(clone);
                    node.remove();
                    node = wrap;
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
                        anchor = $(dir[key]);
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
                                var scope = $(this); // handle
                                if(e.which == 1) { // 限制左键拖动
                                    var random = +new Date(); // 时间戳用来做事件命名空间
                                    var mouseX = e.pageX, mouseY = e.pageY;
                                    var startPosition = {
                                    };
                                    (function() {
                                        var offset = node.offset();
                                        startPosition.x = offset.left;
                                        startPosition.y = offset.top;
                                        startPosition.width = node.width();
                                        startPosition.height = node.height();
                                        startPosition.position = node.css('position');
                                        if(startPosition.position == 'static' || !startPosition.position) {
                                            startPosition.position = 'relative';
                                            node.css('position', startPosition.position);
                                        }
                                    })();
                                    var action = {
                                        start: function(e) {
                                            status = 1;
                                            if(params.proxy) { // 代理容器节点生成
                                                (function() {
                                                    var proxy = v.clone();
                                                    if(params.proxy === 'dashed') {
                                                        proxy.css({
                                                            border: '1px dashed #555',
                                                            background: 'transparent'
                                                        });
                                                        proxy[0].innerHTML = '';
                                                    }
                                                    if(params.hide !== false) {
                                                        node.css('visibility', 'hidden');
                                                    }
                                                    node.parent()[0].appendChild(proxy);
                                                })();
                                            } else { //
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
                                            win.bind('blur.' + random, action.end); // 失去焦点时候触发mouseup，防止resize过程光标被其他程序抢夺后导致回到界面鼠标其实处于mouseup状态却可以resize);
                                            if(scope[0].setCapture) {
                                                scope[0].setCapture();
                                                scope.bind('losecapture.' + random, action.end);
                                            }
                                            if(params.scroll !== true) { // 拖动时候不影响滚动条，设置true则可以在拖动到边缘的同时让滚动条滚动
                                                e.preventDefault();
                                            }
                                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                            event.trigger('start', [e, scope, node]); // 事件对象，handle，resize对象节点
                                        },
                                        drag: function(e) {
                                            if(status == 1 || status == 2) {
                                                if(status == 1) {
                                                    status = 2;
                                                }
                                                params.action ? params.action(e, dir, node, startPosition, params) : helper.resize(e, dir, node, startPosition, params);
                                                if(params.scroll === true) { // 拖动支持滚动条响应时候要清除文本选择（滚动条的运动应该就是文本选择导致的，设置禁止选择文本滚动条则不会响应resize）
                                                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                                }
                                                event.trigger('resize', [e, dir, node, startPosition, params]); //
                                            }
                                        },
                                        end: function(e) {
                                            status = 0;
                                            if(params.proxy) {

                                            }
                                            event.trigger('end', [e, scope, node]);
                                            if(scope[0].releaseCapture) {
                                                scope[0].releaseCapture();
                                            }
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
