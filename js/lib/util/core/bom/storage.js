define(function(require, exports, module) {
    var $ = require('../../../jquery/sea_jquery.js');
    /**
     * localStorage：标准本地存储，IE8+，FF3.0+，Opera10.5+，Chrome4+，Safari4+，iPhone2+，Android2+
     * 因此标准浏览器都支持，对于不支持的IE6，7使用IE特有的UserData来支持，其他低版本浏览器使用cookie支持
     *
     * localStorage限制：
     *     一般为5MB，UserData通常不能超过1M，单文件不超过64KB
     *     时间不受限制
     *
     * localStorage标准支持以下方法：
     *     setItem(key, value)：设置一个本地存储
     *     getItem(key)：获取对应存储
     *     removeItem(key)：移除对应存储
     *     key(i)：遍历所有localStorage
     * 支持以下属性：
     *     length：存放的key的数量
     * 支持以下事件：
     *     storage：当某个key的值有改变或者被删除时候会通知其他窗体响应的事件
     *         由于模拟的UserData可以通过定时器来处理，并且判断值和当前窗体值不一样来触发事件
     *         但这种实现相对来说麻烦，因此目前此事件不太适合来做兼容性的处理
     *
     * 用途：
     *     1. 本地数据保存，即便用户关掉浏览器下次访问还可以还原临时数据，常用在表单临时保存。但涉及用户相关的最好做些加密操作
     *     2. 利用storage事件达到窗体之间的通知
     */
    var storage = window.localStorage ||
    (function() {
        var node = document.createElement('input');
        var api;
        if (node.addBehavior) {
            var isInit = false;
            var init = function() {
                if (!isInit) {
                    try {
                        var expires = new Date();
                        node.type = 'hidden';
                        node.addBehavior('#default#userData');
                        document.body.appendChild(node);
                        expires.setDate(expires.getDate() + 3650);
                        node.expires = expires.toUTCString();
                        isInit = true;
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            };
            var dataFileName = location.hostname;
            api = {
                setItem: function(key, value) {
                    if (init()) {
                        node.load(dataFileName);
                        node.setAttribute(key, value);
                        node.save(dataFileName);
                    }
                },
                getItem: function(key) {
                    var value = '';
                    if (init()) {
                        node.load(dataFileName);
                        value = node.getAttribute(key);
                    }
                    return value;
                },
                removeItem: function(key) {
                    if (init()) {
                        node.load(dataFileName);
                        node.removeAttribute(key);
                        node.save(dataFileName);
                    }
                }
            };
        } else { // 使用cookie
            var cookie = require('./cookie.js');
            node = null;
            api = {
                setItem: function(key, value) {
                    cookie.set(key, value, 3650 * 24 * 3600 * 1000);
                },
                getItem: function(key) {
                    return cookie.get(key);
                },
                removeItem: function(key) {
                    cookie.del(key);
                }
            };
        }
        return api;
    })();
    
    var r = {
        /**
         * 设置一个localStorage
         * @param {String} key 键
         * @param {String} value 值
         * @return {Undefined}
         */
        set: function(key, value) {
            storage.setItem(key, value);
        },
        /**
         * 获取一个localStorage
         * @param key {String} key 键
         * @return {String} 对应的值，没有获取到返回空字符串
         */
        get: function(key) {
            return storage.getItem(key) || '';
        },
        /**
         * 删除一个localStorage
         * @param {String} key 键
         * @return {Undefined}
         */
        del: function(key) {
            storage.removeItem(key);
        }
    };
    return r;
});
