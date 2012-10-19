define(function (require, exports, module) {
    var $ = require('jquery');
    var widget = require('../widget.js');
    var drag = require('../../util/core/dom/drag');
    var resize = require('../../util/core/dom/resize');
    var mask = require('./mask');
    var position = require('../../util/core/dom/position');
    var mVar = require('../../util/core/dom/mVar');
    var tpl = require('./tpl/dialog.tpl.js');

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
                    minWidth:this.minWidth,
                    minHeight:this.minHeight,
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
                this._mask = new mask({
                    params:{
                        opacity:this.opacity
                    }
                });
                this._mask.init().render();
            },
            unreg:function () {
                this._mask.unrender();
            }
        }
    };

    var dialog = widget.create({
        params:{
            title:'', // 标题
            content:'', // 内容
            close:true, // 关闭按钮
            minWidth:150, // 最小宽度，还受限于title的宽度
            minHeight:80,
            drag:true, // 拖拽
            resize:true, // 拖拽
            mask:true, // 遮罩
            opacity:0.5, // 遮罩透明度
            esc: true // ESC 按键关闭
        },
        tpl:function () { // 模板
            return tpl.render(this);
        },
        afterRender:function () { // 展示后切面，居中
            this.mask === true && helper.mask.reg.call(this);
            this.element.css({
                zIndex:mVar.zIndex()
            });
            this.minWidth = Math.max(this.minWidth, this.element.find('.title').width());
            this.resize === true && helper.resize.reg.call(this);
            this.drag === true && helper.drag.reg.call(this);
            this.center();
        },
        afterUnrender:function () {
            this.mask === true && helper.mask.unreg.call(this);
            this.resize === true && helper.resize.unreg.call(this);
            this.drag === true && helper.drag.unreg.call(this);
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
                    position.center(this.element);
                }
            },
            {
                node:$(document),
                type:'keyup',
                action:function (e) {
                    if (this.esc) {
                        this.unrender();
                    }
                }
            }
        ],
        proto:{ // 原型链增加方法
            setTitle:function (title) {
                this.title = title;
                this.element.find('.title').eq(0).html(title);

                if (this.resize === true) {
                    var w = this.element.find('.titleBar').width();
                    if (w > this.minWidth) {
                        this.minWidth = w;
                        this.element.find('.content').eq(0).width(w);
                        this._resize.set({
                            minWidth:w
                        });
                    }
                }
                this.center();
                return this;
            },
            setContent: function(content) {
                this.content = content;
                this.element.find('.content').eq(0).html(content);
                this.center();
                return this;
            },
            center:function () {
                position.center(this.element);
                return this;
            }
        }
    });

    return dialog;
});