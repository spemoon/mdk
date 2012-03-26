define(function(require, exports, module) {
    var $ = require('../../jquery/1.7.1/sea_jquery.js');

    var single = {}; // 挂载ajax单例命名空间
    var pool = {}; // 挂载ajax连接池命名空间
    var config = {
        loginPage:'/',
        noPermissionAction:function() {
            location.href = config.loginPage;
        },
		errorAction: function(xhr, status) {
			
		},
        type:'GET'
    };
	
	// 防止ESC键导致终端AJAX请求,这种情况下AJAX的状态值是error
	$(document).keydown(function(e) {
		if(e.keyCode == 27) {
			return false;
		}
	});
	
    var r = {
        /**
         * 设置登录页面的URL，该方法最多调用一次
         * @param {String} url 登录页面的URL
         */
        setLoginPage:function(url) {
            config.loginPage = url;
            r.setLoginPage = null;
        },
        /**
         * 设置无权限时候的默认动作，默认是跳转到登录页面，该方法最多调用一次
         * @param {Function} callback 无权限时的回调
         */
        setNoPermissionAction:function(callback) {
            config.noPermissionAction = callback;
            r.setNoPermissionAction = null;
        },
		setErrorAction: function(callback) {
			config.setErrorAction = callback;
            r.setErrorAction = null;
		},
        /**
         * 设置默认AJAX的请求类型，该方法最多调用一次
         * @param type
         */
        setType:function(type) {
            config.type = type;
            r.setType = null;
        },
        /**
         * 基类ajax，要求服务端返回的结果格式必须是以下格式的JSON：
         * {
         *     code: 状态码，一般就以下三个：200成功/400失败/401无权限
         *     data: 返回的数据源
         * }
         * @param {Object} params
         *     url：请求的URL
         *     type：请求的类型，默认为GET，若是POST，则需设置该参数为POST
         *     cache：是否使用缓存，默认true缓存, false不缓存
         *     data：请求参数，一般使用一个object
         *     before：发起ajax请求之前的回调
         *     error：server异常时候的回调（非服务端代码级别返回，而是服务器直接返回，比如超时，请求放弃，服务器异常等）,如果没有设定，将调用全局的异常处理，全局默认不处理，是个空函数，可调用setErrorAction来设置全局异常处理动作
         *     success：服务端正确处理后的返回状态码200的回调函数
         *     failure：服务端正确处理后的返回状态码400的回调函数，标识处理失败
         *     permission：服务端正确处理后的返回状态码是401的回调函数，标识无权限，如果没有设定，将调用全局的无权限处理，全局默认跳转到网站根目录，可调用setNoPermissionAction来设置全局无权限处理动作
         *     complete：服务端正确处理后无论状态码返回什么都触发的回调函数
         * @return {Object} XMLHttpRequrest对象
         */
        base:function(params) {
            var obj = {};
            params = params || {};
            obj.url = params.url;
			obj.data = params.data;
            obj.dataType = 'json';
            obj.type = params.type || config.type;
            obj.success = function(data) {
                if(data) {
                    if(data.code == 200) { // 成功
                        params.success && params.success(data);
                    } else if(data.code == 401) { // 无权限
                        params.permission ? params.permission(data) : config.noPermissionAction();
                    } else { // 服务端判定失败
                        params.failure && params.failure(data);
                    }
                }
            };
            obj.error = function(xhr, status) {
				if (status != 'abort') { // 主动放弃，这种一般是程序控制，不应该抛出error
					params.error ? params.error(xhr, status) : config.errorAction(xhr, status);
				}
            };
            obj.complete = function(xhr, status) {
                params.complete && params.complete(xhr, status);
            }
			params.before && params.before();
            return $.ajax(obj);
        },
        /**
         * 构建ajax连接池，存放在pool中，pool结构如下：
         * {
         *     poolName: {
         *         1: [],
         *         2: [],
         *         ...
         *         priority: []
         *     }
         * }
         * @param {String} name 连接池名称
         * @param {Integer} max 最大并发数
         * @param {Integer} priority 有多少个优先级(最高优先级为1，往后优先级越低)
         * @return {Object} 返回对创建的连接池的操作方法：增加连接，放弃连接
         */
        pool:function(name, max, priority) {
            if(!pool[name]) { // 连接池未建立
                var n = 0; // 当前连接数量
                pool[name] = {}; // 存放连接
                var list = pool[name];
                max = Math.max(1, parseInt(max) || 1);
                priority = Math.max(1, parseInt(priority) || 1);
                for(var i = 1; i <= priority; i++) {
                    list[i] = [];
                }
                /*
                 * 发送请求，并在请求结束后处理队列
                 */
                var activeXHR = {};
                var send = function() {
                    if(n < max) {
                        for(var i = 1; i <= priority; i++) {
                            if(list[i].length > 0) {
                                var obj = list[i].shift();
                                if(obj) {
                                    var xhrId = +new Date() + '_' + Math.random();
                                    var completeFn = obj.complete;
                                    n++;
                                    obj.complete = (function(xhrId) {
                                        return function(xhr, status) {
                                            n--;
                                            if(status != 'success') {
                                                xhr && xhr.abort();
                                            }
                                            completeFn && completeFn(xhr, status);
                                            activeXHR[xhrId] = null;
                                            delete activeXHR[xhrId];
                                            send();
                                        };
                                    })(xhrId);
                                    activeXHR[xhrId] = r.base(obj);
                                    break;
                                }
                            }
                        }
                    }
                };
                var actions = {
                    /**
                     * 给连接池增加一个连接
                     * @param {Object} params 同base方法的参数
                     * @param {Integer} p 优先级
                     * @return {Undefined}
                     */
                    add:function(params, p) {
                        if(p && list[p]) {
                            list[p].push(params);
                        } else { // 不在定义优先级范围内或不提供优先级，当作优先级最低
                            list[priority].push(params);
                        }
                        send();
                    },
                    /**
                     * 放弃连接池中所有AJAX请求，并清空该连接池
                     */
                    abort:function() {
                        if(list) {
                            for(var i = 1; i <= priority; i++) {
                                list[i].length = 0;
                            }
                            for(var objId in activeXHR) {
                                activeXHR[objId].abort();
                            }
                        }
                    }
                };
                return actions;
            }
        },
        /**
         * AJAX单例模式：
         *     如果请求资源和上一次相同，则放弃后来的请求
         *     如果请求资源和上一次不同，则中断之前的请求，使用后面的请求
         * @param {String} name 单例命名空间
         * @return {Object} 返回对创建的单例的操作方法：发起请求，放弃请求
         */
        single:function(name) {
            if(!single[name]) {
                single[name] = {};
            }
            var actions = {
                /**
                 * 发起一个AJAX单例请求
                 * @param params 同base方法的参数
                 * @return {undefined}
                 */
                send:function(params) {
                    var flag = single[name].url && (params.url == single[name].url);
                    if(flag) { // 请求URL相同
                        for(var i in params.data) {
                            if(params.data[i] != single[name].data[i]) { // 请求的数据也相同，则认为是发起同一个请求
                                flag = false;
                                break;
                            }
                        }
                    }
                    if(flag) { // 请求的URL和参数相同则保留上一个
                        return;
                    } else { // 不相同则放弃前一个请求
                        single[name].xhr && single[name].xhr.abort();
                    }
                    var completeFn = params.complete;
                    params.complete = function(xhr, status) {
                        single[name] = {}; // 完成后清理
                        completeFn && completeFn(xhr, status);
                    };
                    single[name] = {
                        xhr:r.base(params),
                        url:params.url,
                        data:params.data
                    };
                },
                /**
                 * 放弃单例AJAX请求
                 */
                abort:function() {
                    if(single[name] && single[name].xhr) {
                        single[name].xhr.abort();
                        single[name] = null;
                    }
                }
            };
            return actions;
        }
    };
	return r;
});
