define(function (require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../util/core/lang');
    var widget = require('../widget');

    var progress = widget.create({
        params:{
            width: 300, // 宽度
            text: '', // 进度条上的提示文字
            percent: 0, // 进度[0,100]
            step: 1,
            flag: false, // 控制是否执行滚动条
            showPercent: true // 是否显示百分比
        },
        tpl:function () { // 模板
            var html = '<div class="m-progress">';
            html += '<div class="m-progress-text">' + this.text + '</div>';
            html += '<div class="m-progress-bar">';
            html += '   <div class="m-progress-text">' + this.text + '</div>';
            html += '</div>';
            html += '</div>';
            return html;
        },
        afterInit:function () {
            var node = this.element;
            var borderWidth = parseInt(node.css('border-left-width')) + parseInt(node.css('border-right-width'));
            node.width(this.width);
            node.find('.m-progress-text').width(this.width - borderWidth);
        },
        events:[
        ],
        proto:{ // 原型链增加方法
            setValue: function(percent) {
                var node = this.element;
                var progressNode = node.children('.m-progress-bar').eq(0);
                this.percent = Math.min(percent, 100);
                progressNode.width(this.width * this.percent / 100);
                if(this.showPercent && this.percent != 0) {
                    this.setText(this.text + ' ' + this.percent + '%');
                }
                if(this.percent >= 100) {
                    lang.callback(this.finish, {
                        scope: this
                    });
                }
                return this;
            },
            reset: function() {
                this.percent = 0;
                this.setText(this.text);
                this.position(0);
                return this;
            },
            setText: function(text) {
                this.element.find('.m-progress-text').text(text);
                return this;
            }
        }
    });

    return progress;
});
