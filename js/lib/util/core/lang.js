define(function(require, exports, module) {
    var $ = require('jquery');
    var r = {
        /**
         * 判断变量是否undefined
         * @param {Mix} val
         * @return {Boolean}
         */
        isUndefined: function(val) {
            return typeof val == 'undefined';
        },
        isString: function(val) {
            return typeof val == 'string';
        },
        /**
         * 判断变量是否是数组
         * @param {Mix} val
         * @return {Boolean}
         */
        isArray: $.isArray,
        /**
         * 判断变量是否是函数
         * @param {Mix} val
         * @return {Boolean}
         */
        isFunction: $.isFunction,
        /**
         * 提供function的继承(利用prototype)
         * @param {Function} subClass 子类
         * @param {Function} superClass 父类
         * @protoFns {Object} 给子类原型链添加的方法集合
         * @return {undefined}
         */
        extend: function(subClass, superClass, protoFns) {
            var F = function() {
            };
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;
            subClass.prototype.superClass = superClass.prototype;
            for(var i in protoFns) {
                subClass.prototype[i] = protoFns[i];
            }
        },
        callback: function(fn, params) {
            var flag = true;
            params = params || {};
            if(r.isFunction(fn)) {
                flag = fn.apply(params.scope, params.params || []) !== false;
            }
            return flag;
        },
        /**
         * 定时器加强
         * @param {Object} params
         *     fn: {Function} 被执行的函数，this指向scope
         *     [clear]: {Boolean} 当定时器被累积时候是否清理之前的定时器
         *     [scope]: {Object} fn的this，默认全局对象
         *     [rule]: {Function} 一个返回boolean的函数，this指向scope，返回true则定时器继续，返回false定时器结束
         *     [step]: {Number/Function} 定时器节拍，毫秒数，如果是一个函数，函数执行结果作为毫秒数，默认128
         *     [start]: {Function} 开始时候回调
         *     [end]: {Function} 结束时候回调
         * @return {Object}
         *     stop: {Function} 停止并清理定时器
         */
        timer: function(params) {
            var timer;
            var fn = function() {
                if(r.isUndefined(params.rule) || (r.isFunction(params.rule) && params.rule.call(params.scope))) {
                    params.fn && params.fn.call(params.scope);
                    if(params.clear !== false) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function() {
                        fn();
                    }, (r.isFunction(params.step) ? params.step() : params.step) || 128);
                } else {
                    clearTimeout(timer);
                    params.end && params.end.call(params.scope);
                }
            }
            params.start && params.start.call(params.scope);
            fn();
            return {
                stop: function() {
                    clearTimeout(timer);
                    params.end && params.end.call(params.scope);
                }
            };
        }
    };

    return r;
});
