define(function(require, exports, module) {
    var $ = require('../../jquery/1.7.1/sea_jquery.js');
    var lang = require('./lang.js');
    var array = require('./array.js');
    var r = {
        /**
         * 去掉字符串两侧的空白
         * @param {String} string 待处理的字符串
         * @return {String}
         */
        trim: function(string) {
            return String.prototype.trim ? string.trim() : $.trim(string);
        },
        /**
         * 将对象转化成url格式的字符串(序列化)
         * @param {Object} obj 待序列化的对象
         * @return {String} 序列化的字符串
         */
        serialize: function(obj) {
            var t = [];
            for(var i in obj) {
                if(lang.isArray(obj[i])) {
                    array.forEach(function(value, index, arr) {
                        t.push(i);
                        t.push('=');
                        t.push(obj[i][index]);
                        t.push('&');
                    }, obj[i]);
                } else {
                    t.push(i);
                    t.push('=');
                    t.push(obj[i]);
                    t.push('&');
                }
            }
            t.pop();
            return t.join('');
        },
        /**
         * 将字符串转化为JSON
         * @param {String} 待处理的字符串
         * @return {Object}
         */
        parseJSON: JSON.parse || $.parseJSON,
        /**
         * 返回字符串的长度,全角字符算两个长度
         * @param {String} string 需要计算长度的字符串
         */
        blength: function(string) {
            return string.replace(/[^\x00-\xff]/g, '**').length;
        },
        /**
         * 从字符串的左边或者右边截取需要长度的字符串(默认左边)
         * @param {String} string 被操作的字符串
         * @param {Integer} n 截取的长度
         * @param {Object} params 附加参数
         *         fullSharp : string中的全角字符算作两个长度
         *         pad : 默认中左边开始截取,取值为right则从右边开始截取
         * @return {String} 截取得到的字符串
         */
        cut: function(string, n, params) {
            params = params || {};
            if(params.fullSharp) { // 全角算两个字符
                var bLen = this.blength(string), nowLen = 0, suitLen = 0;
                if(bLen <= n) { // 全角长度还不如n,则返回全部,减少计算量
                    return string;
                }
                var t = n / 2, temp;
                t = t != parseInt(t) ? parseInt(t) - 1 : t;
                temp = params.pad == 'right' ? string.slice(string.length - t) : string.slice(0, t);
                suitLen = this.blength(temp);
                nowLen = temp.length;
                for(var i = nowLen, len = string.length; i < len; i++) {
                    if(suitLen < n && nowLen < bLen) {
                        t = params.pad == 'right' ? len - i - 1 : i;
                        /[^\x00-\xff]/.test(string.charAt(t)) ? suitLen += 2 : suitLen++;
                        nowLen++;
                    } else {
                        break;
                    }
                }
                return params.pad == 'right' ? string.slice(string.length - nowLen) : string.slice(0, nowLen);
            } else {
                return params.pad == 'right' ? string.slice(string.length - n) : string.slice(0, n);
            }
        },
        /**
         * 将html标签的字符串转义(或者将转义后的转回来)
         * @param {String} string 被操作的字符串
         * @param {Boolean} isDecode 反转义,默认是转义，无需该参数
         */
        code: function(string, isDecode) {
            if(isDecode) {
                var r = [/&amp;/g, /&gt;/g, /&lt;/g], s = ['&', '>', '<'];
            } else {
                var r = [/&/g, />/g, /</g], s = ['&amp;', '&gt;', '&lt;'];
            }
            for(var i = 0, len = s.length; i < len; i++) {
                string = string.replace(r[i], s[i]);
            }
            return string;
        }
    };
    return r;
});
