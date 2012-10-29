define(function(require, exports, module) {
    var $ = require('jquery');
    var lang = require('../util/core/lang');
    var mVar = require('../util/core/dom/mVar');
    var action = require('../util/core/dom/action');
    var AOP = ['beforeInit', 'afterInit', 'beforeRender', 'firstRender', 'afterRender', 'beforeUnrender', 'afterUnrender', 'beforeDestory', 'afterDestory'];

    var widget = function() {
    };
    widget.STATUS = {
        NOT_INIT: 0,
        INITED: 1,
        RENDERED: 2,
        UNRENDERED: 3,
        DESTORYED: 4
    };
    widget.prototype = {
        constructor: widget,
        /**
         * 初始化，负责生成结构，渲染样式，
         */
        init: function() {
            if(this._status == widget.STATUS.NOT_INIT && this.singleton !== true) { // 未初始化才执行初始化
                if(lang.callback(this._aop.beforeInit, {scope: this})) {
                    var element;
                    if(!this.element) {
                        if(this.tpl) {
                            if(lang.isFunction(this.tpl)) {
                                this.element = $(this.tpl());
                            } else {
                                this.element = $(this.tpl);
                            }
                        } else {
                            this.element = $('<div/>');
                        }
                        this.renderTo.append(this.element);
                    }
                    this._status = widget.STATUS.INITED;
                    lang.callback(this._aop.afterInit, {scope: this});
                    this.element.trigger('inited', [this]);
                }
            }
            return this;
        },
        render: function() {
            if(this._status == widget.STATUS.INITED || this._status == widget.STATUS.UNRENDERED) { // 已经初始化或者unrender情况下
                if(lang.callback(this._aop.beforeRender, {scope: this})) {
                    this.element.show();
                    (function(events, scope) {
                        for(var i = 0, event; event = events[i]; i++) {
                            scope.bind(event);
                        }
                    })(this._events, this);
                    if(this._status == widget.STATUS.INITED) {
                        lang.callback(this._aop.firstRender, {scope: this}); //
                    }
                    this._status = widget.STATUS.RENDERED;
                    lang.callback(this._aop.afterRender, {scope: this});
                    this.element.trigger('rendered', [this]);
                }
            }
            return this;
        },
        unrender: function() {
            if(this._status == widget.STATUS.RENDERED) {
                if(lang.callback(this._aop.beforeUnrender, {scope: this})) {
                    this.element.hide();
                    this._status = widget.STATUS.UNRENDERED;
                    (function(events, scope) {
                        for(var i = 0, event; event = events[i]; i++) {
                            scope.unbind(event);
                        }
                    })(this._events, this);
                    lang.callback(this._aop.afterUnrender, {scope: this});
                    this.element.trigger('unrendered', [this]);
                    if(this.autoDestory === true) {
                        this.destory();
                    }
                }
            }
            return this;
        },
        destory: function() {
            if(!lang.isUndefined(this._status)) {
                if(lang.callback(this._aop.beforeDestory, {scope: this})) {
                    this._status = widget.STATUS.DESTORYED;
                    for(var i = 0, len = this._events.length; i < len; i++) {
                        this.unbind(this._events[i]);
                    }
                    this.element.unbind();
                    lang.callback(this._aop.afterDestory, {scope: this});
                    this.element.trigger('destoryed', [this]);
                    this.element.remove();
                    if(this.constructor.singleton) {
                        delete this.constructor.singleton;
                    }
                    for(var p in this) {
                        if(this.hasOwnProperty(p)) {
                            delete this[p];
                        }
                    }
                }
            }
            return this;
        },
        getStatus: function() {
            return this._status;
        },

        bind: function(event) {
            if(event.action) {
                var _this = this;
                event.node = event.node || this.element;
                event.type = event.type || ('click.es' + this._eventId++); // 绑定了命名空间，方便unbind
                if(event.type.indexOf('.es') == -1) {
                    event.type += '.es' + this._eventId++;
                }
                event.node.bind(event.type, function(e) {
                    return event.action.call(_this, e);
                });
            } else {
                var obj = {};
                for(var key in event) {
                    obj[key] = {
                        action: event.action || event[key],
                        scope: event.scope || this
                    };
                }
                action.listen(obj, this.element);
            }
            return this;
        },
        unbind: function(event) {
            if(event.node) {
                event.node.unbind(event.type);
            }
            return this;
        },
        trigger: function(name) {
            this.element.trigger(name, Array.prototype.slice.call(arguments, 1));
            return this;
        },
        inject: function(widgets) {
            for(var key in widgets) {
                this.widgets[key] = widgets[key];
            }
            return this;
        }
    };
    // 当init，render，unrender，destory被重写时，留给外部的接口
    widget.prototype._init = widget.prototype.init;
    widget.prototype._render = widget.prototype.render;
    widget.prototype._unrender = widget.prototype.unrender;
    widget.prototype._destory = widget.prototype.destory;

    return {
        STATUS: widget.STATUS,
        /**
         * widget构造器
         * @param params 由widget组件提供
         *     create时候提供：
         *         extend: 父类
         *         params: 绑在this上的成员变量，一般用来提供初始值
         *         proto: 绑在原型链上的方法
         *         renderTo: 渲染的父节点
         *         tpl: 模板
         *         events: 事件列表
         *     切面可以由create或者实例化参数中提供，如果两者都提供，实例化的将覆盖create提供
         */
        create: function(params) {
            var superClass = params.extend;
            var Class = function(config) {
                config = config || {};
                if(params.singleton === true) { // 单例模式，单例模式不支持继承
                    if(Class.singleton) { // 判断是否已经实例化
                        this.singleton = true;
                        return Class.singleton;
                    }
                }
                widget.call(this, params); // 基类
                if(lang.isFunction(superClass)) { // 父类
                    superClass.call(this, config);
                    this.parent = superClass.prototype;
                }
                if(params.tpl) {
                    this.tpl = params.tpl;
                }
                if(config.element || params.element) {
                    this.element = config.element || params.element;
                }
                (function(scope) {
                    for(var i in params.params) { // 复制属性
                        scope[i] = params.params[i];
                    }
                    for(var i in config.params) { // 复制属性
                        scope[i] = config.params[i];
                    }
                })(this);

                if(lang.isUndefined(this._events)) {
                    this._events = [];
                    this._eventId = 0; // 标识事件ID，主要提供给解绑时候使用
                }
                if(params.events) {
                    (function(events, scope) {
                        /**
                         * bugfix: 原先直接使用scope._events.push(events[i])而未进行一次拷贝
                         * 由于后面对事件的对象会直接进行修改，会导致多个实例之间的事件互相访问
                         * 因此事件对传入的事件每次实例化时进行一次拷贝
                         */
                        for(var i = 0, len = events.length; i < len; i++) {
                            var obj = {};
                            for(var key in events[i]) {
                                obj[key] = events[i][key];
                            }
                            scope._events.push(obj);
                        }
                    })(params.events, this);
                }

                if(lang.isUndefined(this._aop)) {
                    this._aop = {}; // 保存切面函数
                }
                (function(scope) {
                    for(var i = 0, len = AOP.length; i < len; i++) {
                        var name = AOP[i];
                        var fn = config[name] || params[name];
                        if(fn) {
                            scope._aop[name] = fn;
                        }
                    }
                })(this);

                this.id = mVar.id(); // 给组件生成唯一的id
                this.renderTo = $(config.renderTo || params.renderTo || document.body); // 渲染节点
                this._status = widget.STATUS.NOT_INIT; // 0：未初始化，1：inited，2：rendered，3：unrendered，4：destoryed
                this.widgets = {}; // 存放外界注入的组件实例，用于组件之间的交互
                this.autoDestory = config.autoDestory || params.autoDestory;

                if(params.singleton === true) { // 标识单例已经实例化
                    Class.singleton = this;
                }
            };
            Class.prototype = new widget();
            Class.prototype.constructor = Class;

            (function() {
                if(superClass) {
                    (function() {
                        for(var method in superClass.prototype) {
                            if(!Class.prototype[method]) { // 复制父类方法
                                Class.prototype[method] = superClass.prototype[method];
                            }
                        }
                    })();
                }

                (function() {
                    for(var i in params.proto) { // 复制原型
                        Class.prototype[i] = params.proto[i];
                    }
                })();
            })();

            return Class;
        }
    };
});