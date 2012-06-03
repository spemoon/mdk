define(function(require, exports, module) {
    require('../../../sample.js');
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var widget = require('../../../../lib/cmp/widget.js');
    var drag = require('../../../../lib/util/core/dom/drag.js');
    var resize = require('../../../../lib/util/core/dom/resize.js');

    $(function() {
        var win = widget.create({
            tpl: function() { // 模板
                var html = '';
                html += '<div class="dialog">';
                html += '    <table>';
                html += '        <tr>';
                html += '            <td class="nw"></td>';
                html += '            <td class="n"></td>';
                html += '            <td class="ne"></td>';
                html += '        </tr>';
                html += '        <tr>';
                html += '            <td class="w"></td>';
                html += '            <td>';
                html += '                <table>';
                html += '                    <tr>';
                html += '                        <td><div class="header">' + (this.title || '{header}') + '<a href="#" data-action="close" class="close" title="关闭">X</a></div></td>';
                html += '                    </tr>';
                html += '                    <tr>';
                html += '                        <td class="content">{content}</td>';
                html += '                    </tr>';
                html += '                    <tr>';
                html += '                        <td class="footer"><input type="button" value="关闭" data-action="close"/></td>';
                html += '                    </tr>';
                html += '                </table>';
                html += '            </td>';
                html += '            <td class="e"></td>';
                html += '        </tr>';
                html += '        <tr>';
                html += '            <td class="sw"></td>';
                html += '            <td class="s"></td>';
                html += '            <td class="se"></td>';
                html += '        </tr>';
                html += '    </table>';
                html += '</div>';
                return html;
            },
            afterInit: function() { // 初始化后切面，注册drag与resize
                var header = this.element.find('.header').eq(0);
                drag.reg({
                    node: this.element,
                    handle: header
                });
                resize.reg({
                    node: this.element,
                    sizeNode: this.element.find('.content'),
                    dir: {
                        ne: this.element.find('.ne'),
                        n: this.element.find('.n'),
                        nw: this.element.find('.nw'),
                        se: this.element.find('.se'),
                        s: this.element.find('.s'),
                        sw: this.element.find('.sw'),
                        e: this.element.find('.e'),
                        w: this.element.find('.w')
                    },
                    minWidth: this.minWidth || 150,
                    minHeight: this.minHeight || 80,
                    paddingRight: this.element.find('.e').width() + this.element.find('.w').width(),
                    paddingBottom: this.element.find('.n').height() + this.element.find('.s').height() + this.element.find('.header').height() + this.element.find('.footer').height()
                });
            },
            afterRender: function() { // 展示后切面，居中
                this.center();
            },
            afterDestory: function() { // 销毁后切面
                console.log('destoryed');
            },
            events: [
                // 事件
                {
                    close: function(e) { // 关闭
                        this.unrender();
                    }
                }
            ],
            proto: { // 原型链增加方法
                center: function() {
                    var width = this.element.width();
                    var height = this.element.height();
                    var doc = $(document);
                    var scrollTop = doc.scrollTop();
                    var scrollLeft = doc.scrollLeft();
                    var win = $(window);
                    var winHeight = win.height();
                    var winWidth = win.width();
                    var isFixed = this.element.css('position') == 'fixed';
                    this.element.css({
                        top: (winHeight - height) / 2 + (isFixed ? 0 : scrollTop),
                        left: (winWidth - width) / 2 + (isFixed ? 0 : scrollLeft)
                    });
                    return this;
                }
            }
        });

        /**--------------------------------------------
         * 实例1： 构建一个window弹出层基类
         * --------------------------------------------*/

/*         (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');

            var w1 = new win({ // 实例1
                params: {
                    title: 'hello',
                    minHeight: 100
                }
            });
            w1.init();

            btn1.click(function() {
                w1.render();
            });
            btn2.click(function() {
                w1.unrender();
            });
            btn3.click(function() {
                w1.destory();
            });

            var w2 = new win({ // 实例2
                params: {
                    title: 'world',
                    minWidth: 300
                },
                afterDestory: function() { // 实例重写切面
                    console.log('my destoryed');
                }
            });
            w2.init().render();

            btn4.click(function() {
                w2.render();
            });
            btn5.click(function() {
                w2.unrender();
            });
            btn6.click(function() {
                w2.destory();
            });
        })();
*/
        /**--------------------------------------------
         * 实例2： 继承
         * --------------------------------------------*/
        (function() {
            var winExt = widget.create({
                extend: win, // 继承
                tpl: '<div class="ext-dialog"><h2 class="header">hello, world</h2> <div><input type="button" data-action="close" value="点击关闭"/><input type="button" data-action="load" value="点击载入"/></div></div>', // 重写tpl模板
                afterDestory: function() { // 重写切面
                    console.log('ext destoryed');
                },
                events: [{
                    load: function() {
                        alert('load')
                    }
                }]
            });

            var btn7 = $('#btn7');
            var btn8 = $('#btn8');
            var btn9 = $('#btn9');
            var btn10 = $('#btn10');
            var btn11 = $('#btn11');
            var btn12 = $('#btn12');

            var we1 = new winExt();
            we1.init();

            btn7.click(function() {
                we1.render();
            });
            btn8.click(function() {
                we1.unrender();
            });
            btn9.click(function() {
                we1.destory();
            });
/*
            var winExt2 = widget.create({
                extend: winExt, // 继承
                afterInit: function() {
                    drag.reg({
                        node: this.element,
                        proxy: 'dashed',
                        handle: 'h2'
                    });
                    resize.reg({
                        node: this.element,
                        proxy: true,
                        all: true,
                        minHeight: this.minHeight || 100,
                        minWidth: this.minWidth || 175
                    });
                }
            });
            winExt2.prototype.center = function() {
                alert('center');
            };

            var we2 = new winExt2();
            we2.init();
            console.log(we2);

            btn10.click(function() {
                we2.render();
            });
            btn11.click(function() {
                we2.unrender();
            });
            btn12.click(function() {
                we2.destory();
            });
*/
        })();
    });
});
