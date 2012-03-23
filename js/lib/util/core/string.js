define(function(require, exports, module) {
    var $ = require('../../jquery/1.7.1/sea_jquery.js');
    var r = {
        trim: String.prototype.trim || $.trim,
        /**
         * 将对象转化成url格式的字符串(序列化)
         * @param {Object} obj 待序列化的对象
         * @return {String} 序列化的字符串
         */
        serialize: function(obj) {
            var t = [];
            for (var i in obj) {
                t.push(i);
                t.push('=');
                t.push(obj[i]);
                t.push('&');
            }
            t.pop();
            return t.join('');
        },
		parseJSON: JSON.parse || $.parseJSON
    };
    return r;
});
