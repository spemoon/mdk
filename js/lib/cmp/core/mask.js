define(function(require, exports, module) {
    var $ = require('jquery');
    var browser = require('../../../lib/util/core/bom/browser.js');
    var widget = require('../widget.js');
    var mVar = require('../../../lib/util/core/dom/mVar.js');

    var helper = {
        render: function(zIndex) {
            var maskNode = this.element.children('div').eq(0);
            var msgNode = this.element.children('div').eq(1);
            if(this.renderTo[0] == document.body) {
                var doc = $(document.body);
                maskNode.css({
                    width: doc.width(),
                    height: doc.height(),
                    zIndex: zIndex
                });
                if(this.msg) {
                    msgNode.children('div').eq(0).html(this.msg);
                    msgNode.css({
                        left: (maskNode.width() - msgNode.width()) / 2,
                        top: ($(window).height() - msgNode.height()) / 2,
                        display: 'block',
                        zIndex: zIndex
                    });
                } else {
                    msgNode.hide();
                }
            } else {
                var position = this.renderTo.css('position');
                if(!position || position == 'static') {
                    this._static = true;
                    this.renderTo.addClass('m-masked-relative');
                }
                if(this.overflow !== false) {
                    this.renderTo.addClass('m-el-masked');
                }
                maskNode.css({
                    left: this.renderTo.scrollLeft(),
                    top: this.renderTo.scrollTop(),
                    width: this.renderTo.width(),
                    height: this.renderTo.height(),
                    zIndex: zIndex
                });
                if(this.msg) {
                    msgNode.children('div').eq(0).html(this.msg);
                    msgNode.css({
                        left: (maskNode.width() - msgNode.width()) / 2,
                        top: (this.renderTo.height() - msgNode.height()) / 2 + this.renderTo.scrollTop(),
                        display: 'block',
                        zIndex: zIndex
                    });
                } else {
                    msgNode.hide();
                }
            }

            if(browser.ie6) {
                var iframe = this.element.children('iframe').eq(0);
                iframe.width(maskNode.width()).height(maskNode.height());
                this.renderTo.find('select').css('visibility', 'hidden');
            }
        },
        cache: {
            find: function(el) {
                for(var i = 0, len = cache.length; i < len; i++) {
                    if(el == cache[i]) {
                        return i;
                    }
                }
                return -1;
            },
            del: function(el) {
                var pos = helper.cache.find(el);
                if(pos != -1) {
                    cache.splice(pos, 1);
                    cacheData.splice(pos, 1);
                }
            }
        }
    };

    var cache = [];
    var cacheData = [];
    var mask = widget.create({
        tpl: function() {
            var html = '';
            html += '<div class="m-mask-box">';
            html += '    <div class="m-mask"></div>';
            html += '    <div class="m-mask-msg' + (this.icon ? ' m-mask-loading' : '') + '">';
            html += '        <div>' + (this.msg || '') + '</div>';
            html += '    </div>';
            if(browser.ie6) {
                html += '<iframe src="#" class="m-mask-iframe" frameborder="0"></iframe>'
            }
            html += '</div>';
            return html;
        },
        params: {
            opacity: 0.5, // 遮罩透明度
            icon: true, // 是否使用图标
            overflow: true // 默认true隐藏超出遮罩的东西，极少数情况下需要显示超出遮罩的部分，设置为false
        },
        beforeInit: function() {
            var pos = helper.cache.find(this.renderTo[0]);
            if(pos != -1) {
                for(var key in cacheData[pos]) {
                    this[key] = cacheData[pos][key];
                }
                return false;
            }
            cache.push(this.renderTo[0]);
            cacheData.push(this);
        },
        proto: {
            render: function(msg) {
                this.msg = msg || '';
                var zIndex = mVar.zIndex();
                if(!this.zIndex) {
                    this.zIndex = [zIndex];
                } else {
                    this.zIndex.push(zIndex);
                }
                this._render();
                helper.render.call(this, zIndex);
                return this;
            },
            unrender: function() {
                if(this._status == 2) {
                    this.zIndex.pop();
                    var len = this.zIndex.length;
                    if(len) {
                        helper.render.call(this, this.zIndex[len - 1]);
                    } else {
                        if(this.renderTo[0] != document.body) {
                            if(this._static) {
                                this.renderTo.removeClass('m-masked-relative');
                            }
                            if(this.overflow !== false) {
                                this.renderTo.removeClass('m-el-masked');
                            }
                        }
                        if(browser.ie6) {
                            this.renderTo.find('select').css('visibility', 'visible');
                        }
                        this._unrender();
                    }
                }
                return this;
            },
            destory: function() {
                if(this.zIndex.length == 0) {
                    helper.cache.del(this.renderTo[0]);
                    this._destory();
                }
                return this;
            }
        },
        events: [
            {
                node: $(window),
                type: 'resize',
                action: function(e) {
                    if(this.renderTo[0] == document.body) {
                        helper.render.call(this);
                    }
                }
            }
        ]
    });

    return mask;
});