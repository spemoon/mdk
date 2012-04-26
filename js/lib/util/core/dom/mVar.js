define(function(require, exports, module) {
    var $ = require('../../../jquery/sea_jquery.js');

    var prefix = 'mdk_';
    var id = 0;
    var zIndex = 10000;
    var p = {
    };

    var r = {
        /**
         * 提供唯一ID
         * @return {String}
         */
        id:function() {
            return prefix + id++;
        },
        /**
         * 提供最高的zIndex
         * @return {Integer}
         */
        zIndex:function() {
            return zIndex++;
        },
        /**
         * 获取一个私有变量的值
         * @param {String} name
         * @return {Undefined}
         */
        get:function(name) {
            return p[name];
        },
        /**
         * 设置一个私有变量的值
         * @param {String} name
         * @param {Mix} val
         * @return {Undefined}
         */
        set:function(name, val) {
            p[name] = val;
        }
    }
    return r;
});
