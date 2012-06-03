define(function(require, exports, module) {
    var $ = require('../../../js/lib/jquery/sea_jquery.js');
    var lang = require('../util/core/lang.js');
    var mVar = require('../util/core/dom/mVar.js');
    var action = require('../util/core/dom/action.js');
    var AOP = ['beforeInit', 'afterInit', 'beforeRender', 'afterRender', 'beforeUnrender', 'afterUnrender', 'beforeDestory', 'afterDestory'];

    return {
        /**
         * 构建一个widget
         * @param params
         * @return {Function}
         */
        create: function(params) {
            /**
             * widget构造器
             * @param config 由widget组件提供
             *     singleton: 是否使用单例模式
             *     extend: 父类
             *     params: 绑在this上的成员变量
             *     renderTo: 渲染的父节点
             *     tpl: 模板
             *     events:
             * @param params 由widget实例提供
             *     params: 绑在this上的成员变量
             *     renderTo: 渲染的父节点
             */
            var widget = function(config) {
                config = config || {};

                if(params.singleton === true) { // 单例模式
                    if(this.singleton === true) { // 判断是否已经实例化
                        return this;
                    }
                }

                if(params.extend) { // 继承构造器
                    var superClass = params.extend;
                    if(superClass) {
                        superClass.call(this, params);
                        this.parent = superClass.prototype;

                        for(var method in superClass.prototype) {
                            widget.prototype[method] = superClass.prototype[method];
                        }
                    }
                }
                if(params.tpl) {
                    this.tpl = params.tpl; // 生成结构的模板
                }

                (function(scope) {
                    for(var i in params.params) { // 复制属性
                        scope[i] = params.params[i];
                    }

                    for(var i in config.params) { // 复制属性
                        scope[i] = config.params[i];
                    }
                })(this);

                this.id = mVar.id(); // 给组件生成唯一的id
                this.renderTo = $(config.renderTo || params.renderTo || document.body); // 渲染节点
                this._status = 0; // 0：未初始化，1：inited，2：rendered，3：unrendered，4：destoryed
                this._widgets = {}; // 存放外界注入的组件实例，用于组件之间的交互

                console.log(this._events)
                if(!this._events) {
                    this._events = [];
                    this._eventId = 0; // 标识事件ID，主要提供给解绑时候使用
                }
                if(params.events) {
                    (function(events, scope) {
                        for(var i = 0, len = events.length; i < len; i++) {
                            scope._events[i] = events[i];
                        }
                    })(params.events, this);
                }

                if(!this._aop) {
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

                if(params.singleton === true) { // 标识单例已经实例化
                    this.singleton = true;
                }
            };

            widget.prototype = {
                constructor: widget,
                /**
                 * 初始化，负责生成结构，渲染样式，
                 */
                init: function() {
                    if(this._status == 0) { // 未初始化才执行初始化
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
                            }
                            element = this.element;
                            this.renderTo.append(this.element);
                            (function(events, scope) {
                                for(var i = 0, event; event = events[i]; i++) {
                                    scope.bind(event);
                                }
                            })(this._events, this);
                            this._status = 1;
                            lang.callback(this._aop.afterInit, {scope: this});
                            this.element.trigger('inited', [this]);
                        }
                    }
                    return this;
                },
                render: function() {
                    if(this._status == 1 || this._status == 3) { // 已经初始化或者unrender情况下
                        if(lang.callback(this._aop.beforeRender, {scope: this})) {
                            this.element.show();
                            this._status = 2;
                            lang.callback(this._aop.afterRender, {scope: this});
                            this.element.trigger('rendered', [this]);
                        }
                    }
                    return this;
                },
                unrender: function() {
                    if(this._status == 2) {
                        if(lang.callback(this._aop.beforeUnrender, {scope: this})) {
                            this.element.hide();
                            this._status = 3;
                            lang.callback(this._aop.afterUnrender, {scope: this});
                            this.element.trigger('unrendered', [this]);
                        }
                    }
                    return this;
                },
                destory: function() {
                    if(lang.callback(this._aop.beforeDestory, {scope: this})) {
                        this.element.hide();
                        this._status = 4;

                        for(var i = 0, len = this._events.length; i < len; i++) {
                            this.unbind(this._events[i]);
                        }
                        this.element.unbind();
                        lang.callback(this._aop.afterDestory, {scope: this});
                        this.element.trigger('destoryed', [this]);
                        for(var p in this) {
                            if(this.hasOwnProperty(p)) {
                                delete this[p];
                            }
                        }
                    }
                    return this;
                },

                bind: function(event) {
                    if(event.action) {
                        event.node = event.node || this.element;
                        event.type = (event.type || 'click') + ('.' + (this._eventId++));
                        event.node.bind(event.type, event.action);
                        this._events.push(event);
                    } else {
                        var obj = {};
                        for(var key in event) {
                            obj[key] = {
                                action: event.action || event[key],
                                scope: event.scope || this
                            };
                            break;
                        }
                        action.listener(obj, this.element);
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
                    this.element.trigger(name, Array.prototype.slice.apply(arguments, 1));
                    return this;
                },
                inject: function(widgets) {
                    for(var key in widgets) {
                        this._widgets[key] = widgets[key];
                    }
                    return this;
                }
            };

            (function() {
                (function() {
                    for(var i in params.proto) { // 复制原型
                        widget.prototype[i] = params.proto[i];
                    }
                })();
            })();

            return widget;
        }
    };
});