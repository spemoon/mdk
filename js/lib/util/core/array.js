define(function(require, exports, module) {
    var $ = require('../../jquery/1.7.1/sea_jquery.js');
    var r = {
        /**
         * 查找数组中是否存在某个值
         * @param {Array} arr 被查找的数组
         * @param {Mix}
        */
        indexOf:function(v, arr) {
            var i;
            if(Array.prototype.indexOf) {
                i = arr.indexOf(v);
            } else {
                i = $.inArray(v, arr);
            }
            return i;
        },
        /**
         * 遍历一个数组，每个元素执行callback，callback作用域是scope
         * @param callback 执行函数，参数是 value，index，array
         * @param arr 数据源
         * @param scope 执行函数的作用域
         */
        forEach:function(callback, arr, scope) {
            if(Array.prototype.forEach) {
                arr.forEach(callback, scope);
            } else {
                for(var i = 0, len = arr.length; i < len; i++) {
                    callback.call(scope, arr[i], i, arr);
                }
            }
        }
    };
    return r;
});
