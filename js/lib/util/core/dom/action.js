define(function(require, exports, module) {
    var $ = require('../../../jquery/1.7.1/sea_jquery.js');
    var lang = require('../lang.js');
    var array = require('../array.js');
    
    var cache = {
        dom: [],
        eventType: [],
        action: []
    };
    
    var r = {
        /**
         * 利用冒泡来做监听，这样做有以下优势：
         *     1. 减少事件绑定数量，提高程序效率，尤其在列表性质的节点上，无需每个节点都绑定
         *     2. 动态生成的内容无需绑定事件也能响应
         *     3. 节点外点击隐藏某些节点
         * @param actions {Object} 响应类型与对应处理事件，
         *     键：是事件源上的data-action属性
         *     值：可能是下面两种格式：
         *         callback：回调函数，当事件源触发时候执行该函数，函数的this是事件源的jQuery节点，参数是事件对象
         *         object：对象，包含两个属性：
         *             is：回调函数，事件源触发时候执行，this是事件源的jQuery节点，参数是事件对象
         *             not：点击在其他节点上时执行的回调函数，this是事件源的jQuery节点，参数是事件对象
         * @param node {Object} jQuery对象，绑定的节点，是父容器
         * @param type 事件类型，默认是click
         * @return {object} jQuery对象，父节点
         */
        listener:function(actions, node, type) {
            actions = actions || {};
            node = node && node[0] ? node : $(document);
            type = type || 'click';
            
            var index = array.indexOf(node[0], cache.dom);
            if(index != -1) {
                if(cache.eventType[index] != type) {
                    index = -1;
                }
            }
            
            if(index == -1) {
                cache.dom.push(node[0]);
                cache.eventType.push(type);
                cache.action.push(actions);
                index = cache.action.length - 1;

                node[type](function(e) {
                    var target = $(e.target);
                    var actionKey = target.data('action') || target.parents('[data-action]').data('action');
                    var flag = true;
                    var fetch = cache.action[index];
                    var fetchAction = fetch[actionKey];
                    if(fetchAction) {
                        if(lang.isFunction(fetchAction)) {
                            flag = fetchAction.call(target, e) === true;
                        } else {
                            if(lang.isFunction(fetchAction.is)) {
                                flag = fetchAction.is.call(target, e) === true;
                            }
                        }
                    }
                    for(var key in fetch) {
                        if(key != actionKey && fetch[key] && fetch[key].not && lang.isFunction(fetch[key].not)) {
                            fetch[key].not.call(target, e);
                        }
                    }
                    return flag;
                });
            } else {
                var fetch = cache.action[index];
                for(var key in actions) {
                    fetch[key] = actions[key];
                }
            }
            return node;
        }
    };
    return r;
});
