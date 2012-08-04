define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var lang = require('../../../../../js/lib/util/core/lang.js');
    var string = require('../../../../../js/lib/util/core/string.js');
    var ajax = require('../../../../../js/lib/util/core/ajax.js');

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
        mainNode: '#content'
    };
    var actions = {};

    $(function() {
        $(document.body).click(function(e) {
            var scope = e.target;
            var target = $(scope);
            var uri = target.attr('data-uri');
            if(uri) {
                var nodeString = $.trim(target.attr('data-node')) || config.mainNode;
                var node = $(nodeString).eq(0);
                var mode = $.trim((target.attr('data-mode') || '').toLowerCase());
                var type = $.trim((target.attr('data-type') || 'GET'));
                if($.inArray(mode, config.mode) == -1) {
                    mode = 'json';
                }

                var view = actions[$.trim(target.attr('data-view'))];
                if(!view) {
                    view = config.action;
                }
                var data = view.before.call(scope, node);
                var prevent = (data === false);

                if(mode == 'json') {
                    if(!prevent) {
                        ajax.single(nodeString).send({
                            url: uri,
                            type: type,
                            data: data,
                            success: function(data) {
                                lang.callback(view.success, {
                                    scope: scope,
                                    params: [node, data]
                                });
                            },
                            failure: function(data) {
                                lang.callback(view.failure, {
                                    scope: scope,
                                    params: [node, data]
                                });
                            },
                            error: function() {
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
                            }
                        });
                    }
                } else if(mode == 'iframe') {
                    ajax.single(nodeString).abort();
                    var iframe = document.createElement('iframe');
                    var flag = view.success == config.action.success; // true表示使用默认行为
                    var width = target.attr('data-width') || config.width;
                    var height = target.attr('data-height') || config.height;
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
    });

    var r = {
        view: function(name, action) {
            if(arguments.length == 2) {
                if(actions[name]) {
                    throw new Error(name + ' 已经被占用');
                } else {
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
                }
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
        }
    };
    return r;
});