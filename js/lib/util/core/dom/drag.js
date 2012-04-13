define(function(require, exports, module) {
    var $ = require('../../../jquery/1.7.1/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    var mVar = require('./mVar.js');
    
    var doc = $(document);
    var win = $(window);
    var status = 0; // 0: 初始或者mouseup时无拖拽，1: mousedown准备拖拽，2: 正在mousemove拖拽
    var helper = {};
    var r = {
        /**
         * @param params
         *        node: 被拖动节点
         *
         */
        reg: function(params) {
            var handle = params.handle ? params.node.find(params.handle) : params.node;
            if (params.except) { // 拖拽句柄排除
                params.node.find(params.except).css('cursor', 'default').mousedown(function(e) {
                    return false;
                });
            }
            
            handle.each(function(index, item) {
                $(item).css('cursor', 'move').mousedown(function(e) {
                    var scope = $(this);
                    if (e.which == 1) { // 限制左键拖动
                        var zIndex = mVar.zIndex(); // 最高z-index
                        var random = +new Date(); // 时间戳用来做事件命名空间
                        var mouseX = e.pageX, mouseY = e.pageY;
                        
                        var nodeList; // 一个或者多个被拖拽的节点，是个数组
                        var startPosition = []; // 被拖拽节点的起始顶点坐标位置
                        var nodeSize = []; // 被拖拽节点的宽高
                        if (lang.isFunction(params.multi)) {
                            nodeList = params.multi();
                            if (nodeList && nodeList.length) {
                                nodeList = [nodeList];
                            } else {
                                nodeList = [params.node.eq(index)];
                            }
                        } else {
                            nodeList = [params.node.eq(index)];
                        }
                        array.forEach(function(v, i, arr) {
                            var offset = v.offset();
                            startPosition[i] = {
                                x: offset.left,
                                y: offset.top
                            };
                            nodeSize[i] = {
                                width: v.outerWidth(),
                                height: v.outerHeight()
                            };
                        }, nodeList);
                        console.log(startPosition);
                        
                        var action = {
                            start: function(e) {
                                status = 1;
                                if (params.proxy) { // 代理容器节点生成
                                    var fragment = document.createDocumentFragment();
                                    proxyList = [];
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
                                        if (params.dashed) {
                                            proxy.css({
                                                border: '1px dashed #555',
                                                background: 'transparent'
                                            });
                                            proxy[0].innerHTML = '';
                                        }
                                        proxyList[i] = proxy;
                                        fragment.appendChild(proxy[0]);
                                        v.css('visibility', 'hidden');
                                    }, nodeList);
                                    document.body.appendChild(fragment);
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
                                if (scope[0].setCapture) {
                                    scope[0].setCapture();
                                    scope.bind('losecapture.' + random, action.end);
                                }
                                if (params.scroll !== true) { // 拖动时候不影响滚动条，设置true则可以在拖动到边缘的同时让滚动条滚动
                                    e.preventDefault();
                                }
                            },
                            drag: function(e) {
                                if (status == 1 || status == 2) {
                                    if (status == 1) {
                                        status = 2;
                                    }
                                    if (params.scroll === true) { // 拖动支持滚动条响应时候要清除文本选择（滚动条的运动应该就是文本选择导致的，设置禁止选择文本滚动条则不会响应拖拽）
                                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                    }
                                    array.forEach(function(v, i, arr) {
                                        var target = params.proxy ? proxyList[i] : v;
                                        var minX, minY, maxX, maxY;
                                        
                                        if (params.container) {
                                            var container = params.container;
                                            var containerWidth = container.width();
                                            var containerHeight = container.height();
                                            var containerOffset = container.offset();
                                            minX = containerOffset.left;
                                            maxX = minX + containerWidth - nodeSize[i].width;
                                            minY = containerOffset.top;
                                            maxY = minY + containerHeight - nodeSize[i].height;
                                        } else {
                                            minX = doc.scrollLeft();
                                            maxX = minX + win.width() - nodeSize[i].width;
                                            minY = doc.scrollTop();
                                            maxY = minY + win.height() - nodeSize[i].height;
                                        }
                                        if (params.axisX) {
                                            minY = maxY = startPosition[i].y;
                                        }
                                        if (params.axisY) {
                                            minX = maxX = startPosition[i].x;
                                        }
                                        target.css({
                                            left: Math.min(Math.max(e.pageX - mouseX + startPosition[i].x, minX), maxX),
                                            top: Math.min(Math.max(e.pageY - mouseY + startPosition[i].y, minY), maxY)
                                        });
                                    }, nodeList);
                                }
                            },
                            end: function(e) {
                                status = 0;
                                if (params.proxy) {
                                    array.forEach(function(v, i, arr) {
                                        var offset = proxyList[i].offset();
                                        v.css({
                                            top: offset.top,
                                            left: offset.left,
                                            position: 'absolute',
                                            visibility: 'visible',
                                            zIndex: zIndex
                                        });
                                        proxyList[i].remove();
                                    }, nodeList);
                                }
                                if (lang.callback(params.drop)) {
                                    lang.callback(params.after);
                                }
                                if (scope[0].releaseCapture) {
                                    scope[0].releaseCapture();
                                }
                                doc.unbind('mousemove.' + random).unbind('mouseup.' + random);
                                scope.unbind('losecapture.' + random);
                                win.unbind('blur.' + random);
                                jQuery.event.triggered = true;
                                setTimeout(function() {
                                    jQuery.event.triggered = false;
                                }, 20);
                            }
                        };
                        action.start(e);
                        doc.bind('mousemove.' + random, action.drag).bind('mouseup.' + random, action.end);
                    }
                });
            });
        }
    };
    return r;
});
