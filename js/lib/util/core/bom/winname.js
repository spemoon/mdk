define(function(require, exports, module) {
    /**
     * window.name 原理
     *     一个浏览器刷新页面后或者修改location后还存在的内容，可以通过这个特性完成以下功能：
     *     1. 内容暂存，防止刷新后丢失
     *     2. 跨域获取内容，例如A域内页面要获取B域内的某个数据，可以通过iframe载入B域页面，B域页面生成window.name
     *        在页面载入后修改页面location为本域任意页面，通常是一个空页面，此时父页面可以访问iframe的window.name
     *        达到跨域功能
     * window.name 大小：2MB（一说最大可以达到32M）
     * 使用：通过一定规则操作window.name这个字符串来达到存储读取删除等功能
     * 规则：
     *     每个键值对之间使用:分割，每一项之间使用;分割
     *     键和值都经过escape处理
     */
    var r = {
        set:function(key, value) {
            var name = window.name;
            key = escape(key);
            value = escape(value);
            var i = name.indexOf(key + '=');
            if(i == -1) { // 原先没有
                name += key + '=' + value + ';';
            } else { // 原先存在
                name = name.replace(new RegExp(key + '=([^;]+);'), function($0, $1) {
                    return $0.replace($1, value);
                });
            }
            window.name = name;
        },
        get:function(key) {
            var name = window.name;
            var result = '';
            key = escape(key);
            var i = name.indexOf(key + '=');
            if(i != -1) { // 找到
                result = name.match(new RegExp(key + '=([^;]+);'))[1];
            }
            return result;
        },
        del:function(key) {
            var name = window.name;
            key = escape(key);
            var i = name.indexOf(key + '=');
            if(i != -1) { // 原先存在
                name = name.replace(new RegExp(key + '=([^;]+);'), '');
            }
            window.name = name;
        },
        proxy:function(dataUrl, proxyUrl, callback) {
            var iframe = document.createElement('iframe');
            var state = 0;
            iframe.src = dataUrl;
            iframe.onload = function() {
                if(state == 0) {
                    state = 1;
                    iframe.contentWindow.location = proxyUrl;
                } else {
                    var data = iframe.contentWindow.name;
                    callback(data);
                    iframe.contentWindow.document.write('');
                    iframe.contentWindow.close();
                    document.body.removeChild(iframe);
                }
            };
        }
    };
    return r;
});
