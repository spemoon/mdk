define(function (require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../util/core/lang');
    var widget = require('../widget');
    var drag = require('../../util/core/dom/drag');

    var slider = widget.create({
        params:{
            val:20, // 当前值，这是百分比
            width:300, // 宽度，这是px
            step:5, // 位移大小1-100，默认5，这是百分比
            min:0, // 最小值，这是百分比
            max:100 // 最大值，这是百分比
        },
        tpl:function () { // 模板
            var html = '<div class="m-slider m-radius" data-action="pos">';
            html += '<div class="m-slider-range"></div>';
            html += '<a href="#" class="m-slider-handle m-radius" data-action="none"></a>';
            html += '</div>';
            return html;
        },
        afterInit:function () {
            this.min = Math.max(this.min, 0);
            this.max = Math.min(this.max, 100);
            this.element.width(this.width);
        },
        afterRender:function () { // 展示后切面
            var _this = this;
            var handle = this.element.find('.m-slider-handle');
            this._drag = drag.reg({
                node:handle,
                axisX:true,
                minX: this.min / 100 * this.width,
                maxX: this.max / 100 * this.width
            });
            this._drag.event.bind('drag', function (scope, node) {
                var left = handle.position().left;
                _this.setValue(left / _this.width * 100);
            });

            this.setValue(this.val);
        },
        afterUnrender:function () {
            this._drag.unreg();
        },
        events:[
            {
                pos:function (e) { // 点击bar设置位置
                    var start = this.element.offset().left;
                    var left = e.pageX;
                    var val = left - start;
                    this.setValue(val / this.width * 100);
                },
                none:function (e) {
                    return false;
                }
            },
            {
                node:function () {
                    return this.element.find('.m-slider-handle');
                },
                type:'keypress',
                action:function (e) {
                    var keyCode = e.keyCode;
                    var flag = false;
                    if (keyCode === 37) {
                        flag = -1;
                    } else if (keyCode === 39) {
                        flag = 1;
                    }
                    if (flag) {
                        this.setValue(this.getValue() + flag * this.step);
                    }
                }
            }
        ],
        proto:{ // 原型链增加方法
            /**
             * @param val 百分数
             */
            setValue:function (val) {
                val = Math.min(Math.max(this.min, val), this.max);
                var node = this.element.find('.m-slider-handle');
                this.val = val;
                this.element.find('.m-slider-range').css('width', this.val + '%');
                node.css('left', this.val + '%').focus();
                lang.callback(this.afterSetValue, {
                    scope:this,
                    params:[this.val]
                });
                return this;
            },
            getValue:function (val) {
                return this.val;
            }
        }
    });

    return slider;
});