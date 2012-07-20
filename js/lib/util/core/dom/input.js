define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var lang = require('../lang.js');
    var string = require('../string.js');
    var browser = require('../bom/browser.js');
    var mVar = require('./mVar.js');

    var isW3C = window.getSelection ? true : false;
    var cursorId = mVar.id();
    /**
     *
     * IE 下TextRange对象
     * 属性：
     *     boundingHeight 获取绑定TextRange对象的矩形的高度
     *     boundingLeft 获取绑定TextRange 对象的矩形左边缘和包含TextRange对象的左侧之间的距离
     *     offsetLeft 获取对象相对于版面或由offsetParent属性指定的父坐标的计算左侧位置
     *     offsetTop 获取对象相对于版面或由offsetParent属性指定的父坐标的计算顶端位置
     *     htmlText 获取绑定TextRange对象的矩形的宽度
     *     text 设置或获取范围内包含的文本
     * 方法：
     *     moveStart 更改范围的开始位置
     *     moveEnd 更改范围的结束位置，是从start开始计算的长度
     *     collapse 将插入点移动到当前范围的开始或结尾，默认值为true，在开始点重合
     *     move 折叠给定文本范围并将空范围移动给定单元数
     *     execCommand 在当前文档、当前选中区或给定范围上执行命令
     *     select 将当前选择区置为当前对象
     *     findText 在文本中搜索文本并将范围的开始和结束点设置为包围搜索字符串
     */
    var r = {
        reg: function(node, action) {
            node = $(node);
            if(browser.ie) {
                // IE9 input事件不支持退格，删除，剪切响应。退格和删除通过keydown事件来响应，剪切通过cut事件响应
                // IE9 cut事件需要通过addEventListener来绑定才有效
                // IE6，7，8 通过propertychange来监听内容改变
                if(browser.ie9) {
                    node.bind('input click', function(e) {
                        var rangeData = r.position.get(this);
                        var lastInput = this.value.charAt(rangeData.end - 1) || '';
                        action.call(this, this.value, lastInput, rangeData);
                    });

                    node.each(function(i, item) {
                        item.addEventListener('cut', function(e) {
                            var rangeData = r.position.get(this);
                            var lastInput = this.value.charAt(rangeData.end - 1) || '';
                            setTimeout(function() {
                                action.call(item, item.value, lastInput, rangeData);
                            }, 0);
                        }, false);
                    });

                    node.bind('keydown', function(e) {
                        if(e.keyCode == 8 || e.keyCode == 46) {
                            var _this = this;
                            var rangeData = r.position.get(this);
                            var lastInput = this.value.charAt(rangeData.end - 1) || '';
                            setTimeout(function() {
                                action.call(_this, _this.value, lastInput, rangeData);
                            }, 0);
                        }
                    });
                } else {
                    node.bind('propertychange click', function(e) {
                        var rangeData = r.position.get(this);
                        var lastInput = this.value.charAt(rangeData.end - 1) || '';
                        action.call(this, this.value, lastInput, rangeData);
                    });
                }
            } else {
                node.bind('input click', function(e) {
                    var rangeData = r.position.get(this);
                    var lastInput = this.value.charAt(rangeData.end - 1) || '';
                    action.call(this, this.value, lastInput, rangeData);
                });
            }
        },
        /**
         * 选择一段文本
         * @param node 节点
         * @param start 起始位置
         * @param end 结束位置
         */
        select: function(node, start, end) {
            start = Math.max(start, 0);
            start = isNaN(start) ? 0 : start;
            end = Math.max(end, start);
            end = isNaN(end) ? start : end;
            node = node[0] || node;
            if(isW3C) {
                node.setSelectionRange(start, end);
                node.focus(); // 必须focus
            } else {
                var range = node.createTextRange();
                var len = node.value.length;
                range.moveStart('character', -len);
                range.moveEnd('character', -len);
                range.moveStart('character', start);
                range.moveEnd('character', end - start);
                range.select();
            }
        },
        /**
         * 从光标所在处插入文本
         * @param node
         * @param text
         * @param callback
         */
        insert: function(node, text, callback) {
            node = node[0] || node;
            node.focus();
            text = text || '';
            var val = node.value;
            var rangeData = r.position.get(node);
            var pos = rangeData.end;
            var len = pos + text.length
            var preText = val.slice(0, pos);
            node.value = preText + text + val.slice(pos);
            rangeData.start = rangeData.end = len;
            if(isW3C) {
                r.position.set(node, rangeData);
            } else {
                // IE下插入会把换行算进去，导致光标往后偏当前所在行的行数个位置
                var arr = preText.match(/\n/g);
                if(arr) {
                    pos -= arr.length;
                }
                len = pos + text.length;
                rangeData.start = rangeData.end = len;
                r.select(node, len, len);
            }
            lang.callback(callback, {
                scope: node,
                params: [pos, text, rangeData]
            });
        },
        position: {
            get: function(node) {
                var rangeData = {text: '', start: 0, end: 0 };
                node = node[0] || node;
                if(isW3C) { // W3C
                    rangeData.start = node.selectionStart;
                    rangeData.end = node.selectionEnd;
                    rangeData.text = (rangeData.start != rangeData.end) ? node.value.substring(rangeData.start, rangeData.end) : '';
                } else if(document.selection) { // IE
                    var oS = document.selection.createRange();
                    var tagName = node.tagName.toUpperCase();
                    var val = node.value;
                    if(tagName == 'TEXTAREA') {
                        var i;
                        var oR = document.body.createTextRange(); // Don't: oR = node.createTextRange()
                        oR.moveToElementText(node);
                        rangeData.text = oS.text;
                        rangeData.bookmark = oS.getBookmark();
                        for(i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart('character', -1) !== 0; i++) {
                            if(val.charAt(i) == '\n') {
                                i++;
                            }
                        }
                        rangeData.start = i;
                        rangeData.end = rangeData.text.length + rangeData.start;
                        rangeData.text = val.substring(0, i);
                    } else if(tagName == 'INPUT') {
                        oS.setEndPoint('StartToStart', node.createTextRange());
                        rangeData.start = rangeData.end = oS.text.length;
                        rangeData.text = '';
                    }
                }
                return rangeData;
            },
            set: function(node, rangeData) {
                node = node[0] || node;
                if(node.setSelectionRange) { // W3C
                    node.focus();
                    node.setSelectionRange(rangeData.start, rangeData.end);
                } else if(node.createTextRange) { // IE
                    var oR = node.createTextRange();
                    if(node.value.length === rangeData.start) {
                        oR.collapse(false);
                    } else {
                        oR.moveToBookmark(rangeData.bookmark);
                    }
                }
            },
            offset: function(node) {
                node = $(node);
                var offset = {};
                if(document.selection && document.selection.createRange) {
                    var range = document.selection.createRange();
                    offset.left = range.offsetLeft;
                    offset.top = range.offsetTop;
                } else {
                    // 没有提供API的浏览器用div模拟：
                    // 获取光标位置，截取文本，放入一个div容器，该容器visibility是hidden，位置和textarea重合
                    // div 的内容和截取的文本一致（做实体替换，然后把\n替换成<br/>，把空格替换成&nbsp;)
                    // 并在末尾增加一个span标签（<span> </span>）
                    // 同时设置div的样式：line-height, font, font-size 和 textarea一致
                    // 这时候这个末尾的span的offset就是光标的offset
                    // 在reg监听中调用offset就可以实时得到光标的位置
                    var cursorDiv = document.getElementById(cursorId);
                    if(!cursorDiv) {
                        cursorDiv = document.createElement('div');
                        cursorDiv.setAttribute('id', cursorId);
                        document.body.appendChild(cursorDiv);
                        cursorDiv.style.visibility = 'hidden';
                        cursorDiv.style.position = 'absolute';
                    }
                    var val = node.val();
                    var nodeOffset = node.offset();
                    val = string.code(val);
                    val = val.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
                    val = val + '<span> </span>';
                    cursorDiv.innerHTML = val;
                    $(cursorDiv).css({
                        top: nodeOffset.top,
                        left: nodeOffset.left,
                        font: node.css('font'),
                        fontSize: node.css('font-size'),
                        lineHeight: node.css('line-height')
                    });
                    var posNode = $(cursorDiv).children('span:last-child');
                    offset = posNode.offset();
                }
                return offset;
            }
        },
        /**
         * textarea自动高度，需要结合reg使用
         * @param {Element} textarea
         * @param {Object} params，包含：
         *     {Integer} minHeight：默认40px
         *     {Integer} maxHeight：默认450px
         */
        autoHeight: function(textarea, params) {
            textarea = textarea[0] || textarea;
            params = params || {};
            if(!browser.ie) {
                textarea.style.height = 0;
            }
            var min = Math.max(params.min || 40, 40);
            var max = Math.max(params.max || 450, 450);
            var scrollHeight = textarea.scrollHeight;
            if(scrollHeight >= min && scrollHeight <= max) {
                textarea.style.height = scrollHeight + 'px';
                textarea.style.overflow = 'hidden';
            } else if(scrollHeight > max) {
                textarea.style.height = max + 'px';
                textarea.style.overflow = 'auto';
            } else {
                textarea.style.height = min + 'px';
                textarea.style.overflow = 'hidden';
            }
        }
    };

    return r;
});