define(function(require, exports, module) {
    var $ = require('../../../jquery/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var mVar = require('./mVar.js');

    var doc = $(document);
    var win = $(window);
    var status = 0; // 0: 初始或者mouseup时无拖拽，1: mousedown准备拖拽，2: 正在mousemove拖拽
    var eventSpace = +new Date();
    var helper = {
        floor: function(num, step) {
            return parseInt(num / step) * step;
        },
        mouseIn: function(e, node) {
            var result;
            node.each(function(i, v) {
                var n = $(v);
                var offset = n.offset();
                if(e.pageX > offset.left && e.pageY > offset.top && (e.pageX < offset.left + n.width()) && (e.pageY < offset.top + n.height())) {
                    result = n;
                    return false;
                }
            });
            return result;
        },
        fixed: function(node, top, left) {
            node.css({
                top: top - doc.scrollTop(),
                left: left - doc.scrollLeft(),
                position: 'fixed'
            });
        }
    };
    var r = {
        reg: function(params) {
            var nodes = lang.isFunction(params.node) ? params.node() : params.node;
            var handle = params.handle ? nodes.find(params.handle) : nodes;
            var multiIsFunction = lang.isFunction(params.multi);
            var proxyIsFunction = lang.isFunction(params.proxy);
            var event = $({}); // 用来绑定事件
            if(params.except) { // 拖拽句柄排除
                nodes.find(params.except).css('cursor', 'default').mousedown(function(e) {
                    return false;
                });
            }
            nodes.find('input,textarea,button').css('cursor', 'default').mousedown(function(e) {
                return false;
            });
            handle.each(function(index, item) {
                item = $(item);
                if(!item.data('draggable')) {
                    item.css('cursor', 'move').data('draggable', true).bind('mousedown.' + eventSpace, function(e) {
                        var node = nodes.eq(index); // 当前要拖拽的节点
                        var targetNode = node; // 当前被拖拽的节点，非proxy时是node，proxy时是代理节点
                        var scope = $(this); // handle
                        if(e.which == 1) { // 限制左键拖动
                            var zIndex = mVar.zIndex(); // 最高z-index
                            var random = +new Date(); // 时间戳用来做事件命名空间
                            var mouseX = e.pageX, mouseY = e.pageY;

                            var nodeList; // 一个或者多个被拖拽的节点，是个数组
                            var proxyList;
                            var startPosition = []; // 被拖拽节点的起始顶点坐标位置
                            var nodeSize = []; // 被拖拽节点的宽高
                            var multiIndex = -1; // 当前拖拽节点在multi中的位置
                            var isEnterTarget = false; // 是否进入drop的目标
                            var preTarget = null; // 上一个进入的drop目标
                            (function() {
                                if(multiIsFunction) {
                                    var tempList = params.multi();
                                    if(tempList && tempList.length) {
                                        nodeList = [];
                                        tempList.each(function(i, v) {
                                            if(v === node[0]) {
                                                multiIndex = i;
                                            }
                                            nodeList[i] = $(v);
                                        });
                                    }
                                }
                                if(multiIndex == -1) {
                                    nodeList = [node];
                                }
                            })();
                            array.forEach(function(v, i, arr) {
                                var position = v.position();
                                startPosition[i] = {
                                    x: position.left,
                                    y: position.top,
                                    position: v.css('position')
                                };
                                nodeSize[i] = {
                                    width: v.width(),
                                    height: v.height(),
                                    outerWidth: v.outerWidth(),
                                    outerHeight: v.outerHeight()
                                };
                            }, nodeList);

                            var action = {
                                start: function(e) {
                                    status = 1;
                                    if(params.proxy) { // 代理容器节点生成
                                        (function() {
                                            var fragment = document.createDocumentFragment();
                                            proxyList = [];
                                            if(proxyIsFunction) {
                                                var div = document.createElement('div');
                                                var $div = $(div);
                                                array.forEach(function(v, i, arr) {
                                                    if((multiIndex == -1 && i == 0) || (multiIsFunction && i == multiIndex)) { // 非multi时取第一个元素（也只可能一个），multi时取被拖拽的那个
                                                        $div.css({
                                                            position: 'absolute',
                                                            display: 'block',
                                                            left: startPosition[i].x,
                                                            top: startPosition[i].y,
                                                            zIndex: zIndex
                                                        });
                                                        div.innerHTML = params.proxy.call(e, node, scope);
                                                        proxyList[0] = $div;
                                                        targetNode = $div;
                                                        fragment.appendChild(div);
                                                    }
                                                    if(params.hide !== false) {
                                                        v.css('visibility', 'hidden');
                                                    }
                                                }, nodeList);
                                            } else {
                                                array.forEach(function(v, i, arr) {
                                                    var css = {
                                                        position: 'absolute',
                                                        display: 'block',
                                                        left: startPosition[i].x,
                                                        top: startPosition[i].y,
                                                        width: nodeSize[i].width,
                                                        height: nodeSize[i].height,
                                                        zIndex: zIndex
                                                    };
                                                    var proxy = v.clone().css(css);
                                                    if((multiIndex == -1 && i == 0) || (multiIsFunction && i == multiIndex)) { // 非multi时取第一个元素（也只可能一个），multi时取被拖拽的那个
                                                        targetNode = proxy;
                                                    }
                                                    if(params.proxy === 'dashed') {
                                                        proxy.css({
                                                            border: '1px dashed #555',
                                                            background: 'transparent'
                                                        });
                                                        proxy[0].innerHTML = '';
                                                    }
                                                    proxyList[i] = proxy;
                                                    fragment.appendChild(proxy[0]);
                                                    if(params.hide !== false) {
                                                        v.css('visibility', 'hidden');
                                                    }
                                                }, nodeList);
                                            }
                                            node.parent()[0].appendChild(fragment);
                                        })();
                                    } else { // 非代理模式情况下将节点处理成absolute
                                        array.forEach(function(v, i, arr) {
                                            v.css({
                                                position: 'absolute',
                                                left: startPosition[i].x,
                                                top: startPosition[i].y,
                                                zIndex: zIndex,
                                                outline: 'none'
                                            });
                                        }, nodeList);
                                        nodeList[0].attr('tabindex', '1').attr('hidefocus', 'true').focus();
                                    }
                                    win.bind('blur.' + random, action.end); // 失去焦点时候触发mouseup，防止拖拽过程光标被其他程序抢夺后导致回到界面鼠标其实处于mouseup状态却可以拖拽);
                                    if(scope[0].setCapture) {
                                        scope[0].setCapture();
                                        scope.bind('losecapture.' + random, action.end);
                                    }
                                    if(params.scroll !== true) { // 拖动时候不影响滚动条，设置true则可以在拖动到边缘的同时让滚动条滚动
                                        e.preventDefault();
                                    }
                                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                    event.trigger('dragstart', [e, scope, node, targetNode, startPosition[index]]); // 事件对象，handle，拖拽对象节点，拖拽对象节点或者代理节点，原始位置信息
                                },
                                drag: function(e) {
                                    if(status == 1 || status == 2) {
                                        var startPositionIndex = Math.max(multiIndex, 0);
                                        if(status == 1) {
                                            status = 2;
                                            if(params.offset && params.axisX !== true && params.axisY !== true) {
                                                startPosition[startPositionIndex] = {
                                                    x: e.pageX - params.offset.left,
                                                    y: e.pageY - params.offset.top
                                                };
                                            }
                                        }
                                        if(params.scroll === true) { // 拖动支持滚动条响应时候要清除文本选择（滚动条的运动应该就是文本选择导致的，设置禁止选择文本滚动条则不会响应拖拽）
                                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                        }
                                        event.trigger('drag', [e, scope, node, targetNode, startPosition[index]]); // 事件对象，handle，拖拽对象节点，拖拽对象节点或者代理节点，原始位置信息
                                        array.forEach(function(v, i, arr) {
                                            var minX, minY, maxX, maxY;
                                            var targetSize = proxyIsFunction ? {
                                                outerWidth: v.width(),
                                                outerHeight: v.height()
                                            } : nodeSize[i];
                                            if(params.container) {
                                                var container = params.container;
                                                var containerWidth = container.width();
                                                var containerHeight = container.height();
                                                var containerPosition = container.position();
                                                minX = containerPosition.left;
                                                maxX = minX + containerWidth - targetSize.outerWidth;
                                                minY = containerPosition.top;
                                                maxY = minY + containerHeight - targetSize.outerHeight;
                                            } else {
                                                var offsetParent = v.offsetParent();
                                                var offsetParentPosition = offsetParent.position();
                                                minX = doc.scrollLeft() - offsetParentPosition.left - parseFloat(offsetParent.css('margin-left')) - parseFloat(v.css('margin-left'));
                                                maxX = minX + win.width() - targetSize.outerWidth;
                                                minY = doc.scrollTop() - offsetParentPosition.top - parseFloat(offsetParent.css('margin-top')) - parseFloat(v.css('margin-top'));
                                                maxY = minY + win.height() - targetSize.outerHeight;
                                            }
                                            if(params.axisX) {
                                                minY = maxY = startPosition[i].y;
                                            }
                                            if(params.axisY) {
                                                minX = maxX = startPosition[i].x;
                                            }

                                            var thisIndex = proxyIsFunction ? startPositionIndex : i;
                                            var currentLeft = e.pageX - mouseX + startPosition[thisIndex].x;
                                            var currentTop = e.pageY - mouseY + startPosition[thisIndex].y;
                                            if(params.grid) {
                                                var preOffset = v.offset();
                                                currentLeft = preOffset.left + helper.floor(currentLeft - preOffset.left, params.grid);
                                                currentTop = preOffset.top + helper.floor(currentTop - preOffset.top, params.grid);
                                            }
                                            v.css({
                                                left: Math.min(Math.max(currentLeft, minX), maxX),
                                                top: Math.min(Math.max(currentTop, minY), maxY)
                                            });
                                        }, params.proxy ? proxyList : nodeList);
                                        if(params.target) {
                                            (function(target) {
                                                if(target) { // 进入
                                                    if(isEnterTarget) { // 之前已经在里面，触发dragover
                                                        event.trigger('dragover', [e, preTarget, scope, node, targetNode, startPosition[index]]);
                                                    } else { // 之前在外面，触发dragenter
                                                        isEnterTarget = true;
                                                        preTarget = target;
                                                        event.trigger('dragenter', [e, preTarget, scope, node, targetNode, startPosition[index]]);
                                                    }
                                                } else { // 没进入
                                                    if(isEnterTarget) { // 之前在里面，触发dragleave
                                                        isEnterTarget = false;
                                                        event.trigger('dragleave', [e, preTarget, scope, node, targetNode, startPosition[index]]);
                                                        preTarget = null;
                                                    }
                                                }
                                            })(helper.mouseIn(e, params.target));
                                        }
                                    }
                                },
                                end: function(e) {
                                    status = 0;
                                    if(params.proxy) {
                                        var position;
                                        if(proxyIsFunction) {
                                            position = proxyList[0].position();
                                            var startPositionIndex = Math.max(multiIndex, 0);
                                            var dx = startPosition[startPositionIndex].x - position.left;
                                            var dy = startPosition[startPositionIndex].y - position.top;
                                            array.forEach(function(v, i, arr) {
                                                v.css({
                                                    top: startPosition[i].y - dy,
                                                    left: startPosition[i].x - dx,
                                                    position: 'absolute',
                                                    visibility: 'visible',
                                                    zIndex: zIndex
                                                });
                                                proxyList[0].remove();
                                            }, nodeList);
                                        } else {
                                            array.forEach(function(v, i, arr) {
                                                position = proxyList[i].position();
                                                v.css({
                                                    top: position.top,
                                                    left: position.left,
                                                    position: 'absolute',
                                                    visibility: 'visible',
                                                    zIndex: zIndex
                                                });
                                                proxyList[0].remove();
                                            }, nodeList);
                                        }
                                    }
                                    array.forEach(function(v, i, arr) {
                                        var position = startPosition[i].position;
                                        var isFixed = position == 'fixed';
                                        if(isFixed) {
                                            var position = v.position();
                                            helper.fixed(v, position.top, position.left);
                                        } else if(params.keepPosition) {
                                            v.css('position', position);
                                        }
                                    }, nodeList);
                                    if(params.target) {
                                        (function(target) {
                                            if(target) { // drop
                                                event.trigger('drop', [e, target, scope, node, startPosition[index]]);
                                            } else {
                                                if(params.revert) {
                                                    var method = params.animate ? 'animate' : 'css';
                                                    array.forEach(function(v, i, arr) {
                                                        var position = startPosition[i];
                                                        v[method]({
                                                            top: position.y,
                                                            left: position.x,
                                                            position: position.position
                                                        });
                                                    }, nodeList);
                                                }
                                            }
                                        })(helper.mouseIn(e, params.target));
                                    }
                                    event.trigger('dragend', [e, scope, node, startPosition[index]]);
                                    if(scope[0].releaseCapture) {
                                        scope[0].releaseCapture();
                                    }
                                    doc.unbind('mousemove.' + random).unbind('mouseup.' + random);
                                    scope.unbind('losecapture.' + random);
                                    win.unbind('blur.' + random);
                                }
                            };
                            if(lang.callback(params.beforeDrag, {
                                scope: scope,
                                params: [e, scope, node]
                            })) {
                                action.start(e);
                                handle.css('cursor', 'move').data('draggable', true);
                                doc.bind('mousemove.' + random, action.drag).bind('mouseup.' + random, action.end);
                            } else {
                                handle.css('cursor', 'default').removeData('draggable');
                            }
                        }
                    });
                }
            });
            return event;
        },
        unreg: function(node, handle) {
            (handle ? node.find(handle) : node).css('cursor', 'default').removeData('draggable').unbind('mousedown.' + eventSpace);
        }
    };
    return r;
});
