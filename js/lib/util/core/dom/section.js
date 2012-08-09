define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var lang = require('../../../../../js/lib/util/core/lang.js');
    var string = require('../../../../../js/lib/util/core/string.js');
    var ajax = require('../../../../../js/lib/util/core/ajax.js');
    var scroll = require('../../../../../js/lib/util/core/dom/scroll.js');

    /**
     * 一个节点上满足以下属性，将会被当作载入section的触发器
     *     data-uri 资源
     *     data-view 视图处理函数名，包括以下3种处理方式（取决于data-mode，默认是json）
     *         json：通过ajax请求data-uri，追加或者覆盖到data-node节点中
     *         iframe: 建立一个iframe，src是data-uri，覆盖到data-node节点中
     *         script: 直接执行
     *         当data-type是iframe时，如果没有data-view，则内容直接覆盖到data-node中
     *     data-type: ajax请求类型，默认GET
     *     data-mode: 展示类型，默认json，可选iframe，script，json
     *     data-node: 承载展示的节点字符串，通过$(...)来转化为节点
     *     data-history: 提供该属性值，将改变URL(HTML5)
     *     data-width: 提供给iframe使用
     *     data-height: 提供给iframe使用
     * 当渲染的节点由ajax异步来渲染内容时候，如果此时有新的渲染请求：
     *     还是之前的请求，则放弃后面的，即后面的不执行(同样ajax请求，url和参数都一致)
     *     如果不是之前的请求，则将ajax请求abort掉(script请求视情况而定)
     * ajax请求返回格式参见 lib/util/core/ajax.js 模块
     * view通过section.view来添加:
     *     section.view({
     *         name: {
     *             before:function(node) { // 可选，node是要被渲染的节点，this指向事件源节点；发送请求前的处理，返回false则不发送请求，如果请求需要带参数，参数就由before返回，会拼接到请求后面
     *             },
     *             success: function(node, data) { // 可选，node是要被渲染的节点，data是返回的数据，this指向事件源节点，请求成功后触发
     *             },
     *             failure: function(node, data) { // 可选，node是要被渲染的节点，data是返回的数据，this指向事件源节点，请求服务端返回失败后触发
     *             },
     *             error: function(node) { // 可选，node是要被渲染的节点，this指向事件源节点，请求发生异常触发
     *             },
     *             complete: function(node) { // 可选，node是要被渲染的节点，this指向事件源节点，请求完成无论成功失败都触发
     *             }
     *         }
     *     });
     *     section.view(name, {...});
     */
    var config = {
        mode: ['json', 'iframe', 'script'],
        width: 575,
        height: 625,
        action: {
            before: function(node) {},
            success: function(node, data) {},
            failure: function(node, data) {},
            error: function(node) {},
            complete: function(node) {}
        },
        mainNode: '#content',
        pageData: { // 滚动加载时候的分页数据
            page: 1,
            pageSize: 15
        }
    };
    var helper = {
        load: function(params, isScroll) {
            if(params) {
                var view = params.view;
                if(!view) {
                    params.view = config.action;
                    view = params.view;
                }
                if(isScroll) {
                    if(!view.scroll) {
                        params.view.scroll = config.action;
                    }
                    view = params.view.scroll;
                }

                var scope = params.scope;
                var nodeString = params.node;
                var uri = params.uri;
                var type = params.type;
                var script = params.script;

                if(isScroll) {
                    (function(obj) {
                        if(obj.scope) {
                            scope = obj.scope;
                        }
                        if(obj.node) {
                            nodeString = obj.node;
                        }
                        if(obj.uri) {
                            uri = obj.uri;
                        }
                        if(obj.type) {
                            type = obj.type;
                        }
                        script = obj.script;
                    })(params.view.scroll);
                }
                var node = $(nodeString).eq(0);

                var uriData = view.before.call(scope, node);
                var prevent = uriData === false;

                if(isScroll) {
                    uriData = $.extend(uriData, pageData);
                }

                if(!prevent) {
                    var response; // server 返回的 data
                    var status; // ajax 的状态
                    ajax.single(nodeString).send({
                        url: uri,
                        type: type,
                        data: uriData,
                        success: function(data) {
                            response = data;
                            status = 'success';
                            pageData.page++;
                            lang.callback(view.success, {
                                scope: scope,
                                params: [node, data]
                            });
                        },
                        failure: function(data) {
                            response = data;
                            status = 'failure';
                            lang.callback(view.failure, {
                                scope: scope,
                                params: [node, data]
                            });
                        },
                        error: function() {
                            status = 'error';
                            lang.callback(view.error, {
                                scope: scope,
                                params: [node]
                            });
                        },
                        complete: function() {
                            lang.callback(view.complete, {
                                scope: scope,
                                params: [node]
                            });
                            if(script) {
                                require.async(seajs.pluginSDK.util.dirname(location.href) + script, function(fn) {
                                    if(scope == activeNode) {
                                        fn.call(scope, node, response, status, view.params);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    };
    var activeNode = null; // 最后一个click冒泡到document上的节点
    var scrollData = false; // 是否支持滚动加载，如果支持scrollData将是一个JSON，以便给加载提供必要的参数
    var pageData;
    var actions = {};

    $(function() {
        $(document.body).click(function(e) {
            var scope = e.target;
            var target = $(scope);
            var uri = target.attr('data-uri');
            activeNode = scope;
            if(uri) {
                var nodeString = $.trim(target.attr('data-node')) || config.mainNode;
                var mode = $.trim((target.attr('data-mode') || '').toLowerCase());
                var type = $.trim((target.attr('data-type') || 'GET'));
                var script = $.trim(target.attr('data-script') || '');
                if($.inArray(mode, config.mode) == -1) {
                    mode = 'json';
                }
                var view = actions[$.trim(target.attr('data-view'))];

                scrollData = false;

                if(mode == 'json') {
                    if(!prevent) {
                        var params = {
                            view: view,
                            scope: scope,
                            node: nodeString,
                            uri: uri,
                            type: type,
                            script: script
                        };
                        if(view.scroll) {
                            scrollData = params;
                        }
                        pageData = $.extend({}, config.pageData);
                        helper.load(params);
                    }
                } else if(mode == 'iframe') {
                    var node = $(nodeString).eq(0);
                    var data = view.before.call(scope, node);
                    var prevent = data === false;
                    var iframe = document.createElement('iframe');
                    var flag = view.before == config.action.before; // 提供before表明手动操作内容，不提供默认会清空节点
                    var width = target.attr('data-width') || config.width;
                    var height = target.attr('data-height') || config.height;

                    ajax.single(nodeString).abort();
                    iframe.src = (function() {
                        var src = uri;
                        if(!prevent) {
                            if(src.indexOf('?') == -1) {
                                src += '?';
                            } else {
                                src += '&';
                            }
                            src += string.serialize(data);
                        }
                        return src;
                    })();
                    iframe.setAttribute('width', flag ? width : 0);
                    iframe.setAttribute('height', flag ? height : 0);
                    iframe.setAttribute('frameBorder', 0);
                    $(iframe).load(function() {
                        lang.callback(view.success, {
                            scope: scope,
                            params: [node, iframe, width, height]
                        });
                        $(iframe).unbind('load');
                    });
                    if(flag) {
                        node[0].innerHTML = '';
                    }
                    if(!prevent) {
                        node[0].appendChild(iframe);
                    } else {
                        $(iframe).unbind('load');
                        iframe = null;
                    }

                } else if(mode == 'script') {
                    if(nodeString) { // script允许没有node
                        ajax.single(nodeString).abort();
                    }
                }
                e.preventDefault();
            }
        });

        // 滚动监听
        scroll.listen(window, {
            bottom: function(e, scrollTop, dir, status) {
                if(scrollData) {
                    helper.load(scrollData, true)
                }
            }
        });
    });

    var r = {
        view: function(name, action) {
            if(arguments.length == 2) {
                if(actions[name] && console && console.warn) {
                    console.warn('section [' + name + '] 已经被占用');
                }
                if(lang.isFunction(action)) {
                    var temp = action;
                    action = {
                        success: temp
                    };
                }
                for(var key in config.action) {
                    if(!action[key]) {
                        action[key] = config.action[key];
                    }
                }
                actions[name] = action;
            } else if(arguments.length == 1) {
                for(var obj in arguments[0]) {
                    r.view(obj, arguments[0][obj]);
                }
            }
        },
        /**
         * 设置ajax默认的处理节点
         * @param nodeString
         */
        setMainNode: function(nodeString) {
            config.mainNode = nodeString;
        },
        /**
         * 获取当前活动的section节点（所有click都会更新activeNode）
         * @return {*}
         */
        getActiveNode: function() {
            return activeNode;
        },
        /**
         * 给对应name的section注入外部变量
         * @param name
         * @param params
         */
        inject: function(name, params) {
            var obj = actions[name];
            if(!obj.params) {
                obj.params = {
                    $: $
                };
            }
            for(var key in params) {
                obj.params[key] = params[key];
            }
        },
        setPageData: function(params) {
            for(var key in params) {
                pageData[key] = params[key];
            }
        }
    };
    return r;
});