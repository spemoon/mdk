define(function(require, exports, module) {
    var $ = require('../../../jquery/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var mVar = require('./mVar.js');

    var doc = $(document);
    var win = $(window);
    var status = 0; // 0: 初始或者mouseup时无resize，1: mousedown准备resize，2: 正在mousemove resize
    var eventSpace = +new Date();
    var helper = {
    };
    var r = {
        reg: function(params) {
            var nodes = lang.isFunction(params.node) ? params.node() : params.node;
            var proxyIsFunction = lang.isFunction(params.proxy);
            var event = $({}); // 用来绑定事件
            handle.each(function(index, item) {
                item = $(item);
                if(!item.data('resizable')) {
                    item.css('cursor', 'move').data('resizable', true).bind('mousedown.' + eventSpace, function(e) {
                        var node = nodes.eq(index); // 当前要resize的节点
                        var targetNode = node; // 当前被resize的节点，非proxy时是node，proxy时是代理节点
                        var scope = $(this); // handle
                        if(e.which == 1) { // 限制左键拖动
                            var random = +new Date(); // 时间戳用来做事件命名空间
                            var mouseX = e.pageX, mouseY = e.pageY;
                            var startPosition = {
                            };
                            (function() {
                                var position = item.position();
                                startPosition.x = position.left;
                                startPosition.y = position.top;
                            })();

                            var action = {
                                start: function(e) {
                                    status = 1;
                                    if(params.proxy) { // 代理容器节点生成
                                        (function() {
                                            var fragment = document.createDocumentFragment();
                                            if(proxyIsFunction) {

                                            } else {

                                            }
                                            node.parent()[0].appendChild(fragment);
                                        })();
                                    } else { // 非代理模式情况下将节点处理成absolute
                                        node.css({
                                            position: 'absolute',
                                            left: startPosition.x,
                                            top: startPosition.y,
                                            outline: 'none'
                                        });
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
                                        if(params.scroll === true) { // 拖动支持滚动条响应时候要清除文本选择（滚动条的运动应该就是文本选择导致的，设置禁止选择文本滚动条则不会响应resize）
                                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                        }
                                        event.trigger('resize', [e, scope, node]); // 事件对象，handle，resize对象节点
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
                                handle.css('cursor', 'move').data('resizable', true);
                                doc.bind('mousemove.' + random, action.drag).bind('mouseup.' + random, action.end);
                            } else {
                                handle.css('cursor', 'default').removeData('resizable');
                            }
                        }
                    });
                }
            });
            return event;
        },
        unreg: function(node, handle) {
            (handle ? node.find(handle) : node).css('cursor', 'default').removeData('resizable').unbind('mousedown.' + eventSpace);
        }
    };
    return r;
});
