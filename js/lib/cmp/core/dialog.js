define(function (require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../util/core/lang');
    var ajax = require('../../util/core/ajax');
    var widget = require('../widget');
    var drag = require('../../util/core/dom/drag');
    var resize = require('../../util/core/dom/resize');
    var mask = require('./mask');
    var position = require('../../util/core/dom/position');
    var mVar = require('../../util/core/dom/mVar');
    var tpl = require('./tpl/dialog');

    var helper = {
        resize:{
            reg:function () {
                this._resize = resize.reg({
                    node:this.element,
                    sizeNode:this.element.find('.content'),
                    dir:{
                        ne:this.element.find('.ne'),
                        n:this.element.find('.n'),
                        nw:this.element.find('.nw'),
                        se:this.element.find('.se'),
                        s:this.element.find('.s'),
                        sw:this.element.find('.sw'),
                        e:this.element.find('.e'),
                        w:this.element.find('.w')
                    },
                    minWidth:this.width,
                    minHeight:this.height,
                    paddingRight:this.element.find('.e').width() + this.element.find('.w').width(),
                    paddingBottom:this.element.find('.n').height() + this.element.find('.s').height() + this.element.find('.header').height() + this.element.find('.footer').height()
                });
            },
            unreg:function () {
                this._resize.unreg();
            }
        },
        drag:{
            reg:function () {
                this._drag = drag.reg({
                    node:this.element,
                    handle:this.element.find('.header').eq(0)
                });
            },
            unreg:function () {
                this._drag.unreg();
            }
        },
        mask:{
            reg:function () {
                if (!this._mask) {
                    this._mask = new mask({
                        params:{
                            opacity:this.opacity
                        }
                    }).init();
                }
                this._mask.render('');
            },
            unreg:function () {
                this._mask.unrender();
            }
        },
        btn:{
            params:function (params) {
                params.text = params.text || '关闭';
                params.action = params.action || 'close';
                params.id = params.id || mVar.id();
                params.focus = params.focus === true;
                params.disable = params.disable === true;
                return params;
            },
            show:function (btn) {
                var _this = this;
                var buttonsNode = this.element.find('.footer>.buttons');
                buttonsNode.append('<button id="' + btn.id + '">' + btn.text + '</button>');
                var node = buttonsNode.find('button:last');
                if (typeof btn.action == 'string') {
                    node.attr('data-action', btn.action);
                } else if (lang.isFunction(btn.action)) {
                    node.bind('click', function (e) {
                        return btn.action.call(_this, e, btn);
                    });
                }
                if (btn.disable === true) {
                    node[0].disabled = true;
                } else {
                    if (btn.focus === true) {
                        node.addClass('state_highlight').focus();
                    }
                }
            },
            build:function () {
                var blen = this.buttons.length;
                if (blen > 0) {
                    for (var i = 0; i < blen; i++) {
                        var btn = this.buttons[i];
                        if (!btn.id) {
                            this.buttons[i] = btn = helper.btn.params(btn);
                        }
                        helper.btn.show.call(this, btn);
                    }
                }
            },
            getIndex:function (id) {
                for (var i = 0, len = this.buttons.length; i < len; i++) {
                    var btn = this.buttons[i];
                    if (btn.id === id) {
                        return i;
                    }
                }
                return -1;
            }
        },
        content:{
            build:{
                html:function (params) {
                    var node = this.element.find('.content').eq(0);
                    this.content = params.content || '';
                    node.html(this.content);
                    helper.content.position.call(this);
                    lang.callback(params.success, {
                        scope:this
                    });
                },
                ajax:function (params) {
                    var node = this.element.find('.content').eq(0);
                    var as = ajax.single('dialog_' + this.id);
                    var _this = this;
                    as.send({
                        url:params.url,
                        data:params.data,
                        before:function () {
                            node.html('<div class="loading"><span> </span></div>');
                        },
                        error:function (xhr, status) {
                            if (params.failure) {
                                params.failure.call(_this, node);
                            } else {
                                node.html('<div>网络错误，请稍候再试</div>');
                            }
                        },
                        failure:function (data) {
                            if (params.failure) {
                                params.failure.call(_this, data, node);
                            } else {
                                node.html('<div>网络错误，请稍候再试</div>');
                            }
                        },
                        success:function (data) {
                            lang.callback(params.success, {
                                params:[data, node],
                                scope:_this
                            });
                        },
                        complete:function () {
                            helper.content.position.call(_this);
                        }
                    });
                }
            },
            position:function () {
                var node = this.element.find('.content').eq(0);
                node.width('auto');

                if(!this.width) {
                    var w = node.width();
                    this.width = w;
                    node.width(w);
                    if (this.resize === true) {
                        this._resize.set({
                            minWidth:w
                        });
                    }
                } else {
                    node.width(this.width);
                }
                this.center === true && this.setCenter();
            },
            icon:function (type, text) {
                var html = '';
                html += '<div class="icon-content">';
                html += '    <div class="icon ' + type + '"></div>';
                html += '    <div class="icon-html">' + text + '</div>';
                html += '</div>';
                return html;
            },
            prompt:function (tip, value) {
                var html = '';
                tip = tip || '';
                value = lang.isUndefined(value) ? '' : value;
                html += '<div class="prompt-content">';
                html += '    <div class="prompt-tip">' + tip + '</div>';
                html += '    <div class="prompt-val"><input value="' + value + '"/></div>';
                html += '</div>';
                return html;
            }
        }
    };

    var config = {
        title:'', // 标题
        content:'', // 内容
        close:true, // 关闭按钮
        width:150, // 最小宽度（内容），还受限于title的宽度
        height:80, // 最小高度（内容）
        center:true, // 居中
        fixed:true, // fix
        // top: // 设定top和left，则center失效
        // left:
        drag:true, // 拖拽
        resize:true, // 拖拽
        mask:true, // 遮罩
        opacity:0.5, // 遮罩透明度
        esc:true, // ESC 按键关闭
        bar:true,
        buttons:[]
    };

    var dialog = widget.create({
        params:$.extend({}, config, true),
        tpl:function () { // 模板
            var html = tpl.render({
                title:this.title,
                hide:this.hide,
                content:this.content
            });
            return html;
        },
        firstRender:function () {
            if (this.bar !== false && this.buttons !== false) {
                if (this.buttons.length == 0) {
                    this.buttons.push({
                        text:'关闭',
                        action:'close'
                    });
                }
                helper.btn.build.call(this);
            } else {
                this.buttons = [];
            }
        },
        afterRender:function () { // 展示后切面，居中
            if (!lang.isUndefined(this.top) || !lang.isUndefined(this.left)) {
                this.center = false;
            }

            if (this._buttons) { // 由render传入的buttons
                if (this.buttons.length) {
                    this.removeAllBtn();
                }
                this.buttons = this._buttons; // 负责指向
                helper.btn.build.call(this);
                this._buttons = null; // 删除引用
            }

            this.mask === true && helper.mask.reg.call(this);
            this.element.css({
                zIndex:mVar.zIndex()
            });
            this.width = Math.max(this.width, this.element.find('.title').width(), this.element.find('.footer').width());
            this.resize === true && helper.resize.reg.call(this);
            this.drag === true && helper.drag.reg.call(this);

            this.element.find('.footer>.buttons')[this.bar === true ? 'show' : 'hide']();

            this.center === true && this.setCenter();
        },
        afterUnrender:function () {
            this.mask === true && helper.mask.unreg.call(this);
            this.resize === true && helper.resize.unreg.call(this);
            this.drag === true && helper.drag.unreg.call(this);
            this.width = 0;
        },
        events:[
            {
                close:function (e) { // 关闭
                    this.unrender();
                }
            },
            {
                node:$(window),
                type:'resize',
                action:function () {
                    this.center === true && this.setCenter();
                }
            },
            {
                node:$(document),
                type:'keyup',
                action:function (e) {
                    if (this.esc && e.keyCode == 27) {
                        this.unrender();
                    }
                }
            }
        ],
        proto:{ // 原型链增加方法
            render:function (params) {
                var node = this.element.find('.content').eq(0);

                params = params || {};
                if (this._status == widget.STATUS.RENDERED) { // 保证可以多次render
                    this._status = widget.STATUS.UNRENDERED;
                }
                if (!lang.isUndefined(params.title)) {
                    this.setTitle(params.title);
                }
                if (!lang.isUndefined(params.width)) {
                    this.width = params.width;
                }
                if (!lang.isUndefined(params.height)) {
                    this.height = params.height;
                }
                if (!lang.isUndefined(params.mask)) {
                    this.mask = !!params.mask;
                }
                if (!lang.isUndefined(params.drag)) {
                    this.drag = !!params.drag;
                }
                if (!lang.isUndefined(params.resize)) {
                    this.resize = !!params.resize;
                }

                if (params.buttons && params.buttons.length) {
                    this._buttons = params.buttons;
                    params.bar = true;
                }

                if (!lang.isUndefined(params.bar)) {
                    this.bar = !!params.bar;
                    if (params.bar === false) {
                        this.removeAllBtn();
                        this.element.find('.footer>.buttons').hide();
                    } else {
                        this.element.find('.footer>.buttons').show();
                    }
                }

                node.width(this.width).height(this.height);

                this._render();

                if (params.top || params.left) {
                    this.setPosition(params);
                }

                if (params.content || params.type) {
                    this.setContent(params);
                }

                return this;
            },
            setTitle:function (title) {
                this.title = title;
                this.element.find('.title').eq(0).html(title);

                var w = this.element.find('.titleBar').width();
                if (w > this.width) {
                    this.width = w;
                    this.element.find('.content').eq(0).width(w);
                    if (this.resize === true) {
                        this._resize.set({
                            minWidth:w
                        });
                    }
                }
                this.center === true && this.setCenter();
                return this;
            },
            setContent:function (params) {
                var type = params.type || 'html';
                helper.content.build[type].call(this, params);
                return this;
            },
            setCenter:function () {
                this.center = true;
                position.center(this.element);
                return this;
            },
            setPosition:function (pos) {
                var o1 = {
                    element:this.element
                };
                var o2 = {};
                var win = $(window);

                this.top = pos.top || 'top';
                this.left = pos.left || 'left';
                this.center = false;

                if (typeof this.top == 'string') {
                    o1.y = this.top;
                    if (this.fixed === true) {
                        if (this.top === 'top') {
                            o2.y = 0;
                        } else if (this.top === 'center') {
                            o2.y = win.height() / 2;
                        } else if (this.top === 'bottom') {
                            o2.y = win.height();
                        }
                    } else {
                        o2.y = this.top;
                    }
                } else {
                    o2.y = this.top;
                }
                if (typeof this.left == 'string') {
                    o1.x = this.left;
                    if (this.fixed === true) {
                        if (this.left === 'left') {
                            o2.x = 0;
                        } else if (this.left === 'center') {
                            o2.x = win.width() / 2;
                        } else if (this.left === 'right') {
                            o2.x = win.width();
                        }
                    } else {
                        o2.x = this.left;
                    }
                } else {
                    o2.x = this.left;
                }
                position.pin(o1, o2);
                return this;
            },
            addBtn:function (params) {
                var _this = this;
                params = helper.btn.params.call(this, params);
                this.buttons.push(params);
                helper.btn.show.call(this, params);
                return this;
            },
            delBtn:function (btn) {
                var buttonsNode = this.element.find('.footer>.buttons');
                var node = buttonsNode.find('#' + btn.id);
                node.unbind().remove();
                var index = helper.btn.getIndex.call(this, btn.id);
                if (index != -1) {
                    this.buttons.splice(index, 1);
                }
                return this;
            },
            removeAllBtn:function () {
                while (this.buttons.length) {
                    var btn = this.buttons[0];
                    this.delBtn(btn);
                }
                this.buttons.length = 0;
                return this;
            },
            disableBtn:function (btn, callback) {
                if (btn.disable === false) {
                    var node = $('#' + btn.id);
                    btn.disable = true;
                    node[0].disabled = true;
                    callback && callback.call(this, node, btn);
                }
                return this;
            },
            enableBtn:function (btn, callback) {
                if (btn.disable === true) {
                    var node = $('#' + btn.id);
                    btn.disable = false;
                    node[0].disabled = false;
                    callback && callback.call(this, node, btn);
                }
                return this;
            },
            alert:function (params) {
                params = params || {};
                params.title = params.title || '提示';
                params.icon = params.icon ? 'icon-' + params.icon : '';
                params.content = params.icon ? helper.content.icon(params.icon, params.content || '') : (params.content || '');
                params.width = params.width || 250;
                params.height = params.height || 80;
                params.resize = params.resize || false;

                var btn = params.button || {};
                btn = helper.btn.params(btn);
                btn.focus = true;
                params.buttons = [btn];

                this.render(params);
                return this;
            },
            confirm:function (params) {
                params = params || {};
                params.title = params.title || '询问';
                params.icon = params.icon ? 'icon-' + params.icon : '';
                params.content = params.icon ? helper.content.icon(params.icon, params.content || '') : (params.content || '');
                params.width = params.width || 250;
                params.height = params.height || 80;
                var ok = params.ok || {};
                ok.text = ok.text || '确定';
                ok = helper.btn.params(ok);
                ok.focus = true;
                var cancel = params.cancel || {};
                cancel.text = cancel.text || '取消';
                cancel = helper.btn.params(cancel);
                params.buttons = [cancel, ok];

                this.render(params);
                return this;
            },
            prompt:function (params) {
                params = params || {};
                params.title = params.title || '请输入';
                params.content = helper.content.prompt(params.tip, params.val);
                params.width = params.width || 250;
                params.height = params.height || 80;

                var ok = params.ok || {};
                var okAction = ok.action;
                ok.focus = true;
                ok.text = ok.text || '确定';
                ok.action = function (e, btn) {
                    okAction.call(this, e, btn, this.element.find('.prompt-val>input').val());
                };
                ok = helper.btn.params(ok);
                var cancel = params.cancel || {};
                cancel.text = cancel.text || '取消';
                cancel = helper.btn.params(cancel);
                params.buttons = [cancel, ok];

                this.render(params);

                this.element.find('.prompt-val>input').focus().select();
                return this;
            }
        }
    });

    return dialog;
});