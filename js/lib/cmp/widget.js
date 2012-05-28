define(function(require, exports, module) {
    var $ = require('../../../js/lib/jquery/sea_jquery.js');
    var mVar = require('../util/core/dom/mVar.js');

    var widget = function(config) {
        if(config.singleton === true) { // 单例模式
            if(this.singleton === true) { // 判断是否已经实例化
                return this;
            }
        }
        this.id = mVar.id(); // 给组件生成唯一的id
        if(config.extend) { // 继承构造器
            var superClass = config.extend;
            if(superClass) {
                superClass.call(this, config);
                this.parent = superClass.prototype;
            }
        }
        for(var i in config.params) { // 复制属性
            this[i] = config.params[i];
        }
        this.renderTo = this.renderTo || document.body; // 渲染节点
        if(config.singleton === true) { // 标识单例已经实例化
            this.singleton = true;
        }
    };
});