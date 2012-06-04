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
                html += '                        <td><div class="header">' + this.title + '<a href="#" data-action="close" class="close" title="关闭">X</a></div></td>';
                html += '                    </tr>';
                html += '                    <tr>';
                html += '                        <td class="content">' + this.content + '</td>';
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
            params: {
                title: '这是标题',
                content: '这是内容'
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

        $('input:button').removeAttr('disabled');

        /**--------------------------------------------
         * 实例1： 构建一个window弹出层基类
         * --------------------------------------------*/

        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');

            var w1 = new win({ // 实例1
                params: {
                    minHeight: 100
                },
                afterDestory: function() {
                    btn1.attr('disabled', 'disabled');
                    btn2.attr('disabled', 'disabled');
                    btn3.attr('disabled', 'disabled');
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
                    btn4.attr('disabled', 'disabled');
                    btn5.attr('disabled', 'disabled');
                    btn6.attr('disabled', 'disabled');
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
        /**--------------------------------------------
         * 实例2： 继承
         * --------------------------------------------*/
        (function() {
            var winExt = widget.create({
                extend: win, // 继承
                tpl: '<div class="ext-dialog"><h2 class="header">hello, world</h2> <div><input type="button" data-action="close" value="点击关闭"/><input type="button" data-action="load" value="点击载入"/></div><div class="load-content"></div></div>', // 重写tpl模板
                beforeRender: function() {
                    this.element.find('.load-content').html('');
                },
                events: [
                    {
                        load: function() {
                            this.element.find('.load-content').html('载入的数据');
                        }
                    }
                ]
            });

            var btn7 = $('#btn7');
            var btn8 = $('#btn8');
            var btn9 = $('#btn9');
            var btn10 = $('#btn10');
            var btn11 = $('#btn11');
            var btn12 = $('#btn12');

            var we1 = new winExt({
                afterDestory: function() {
                    btn7.attr('disabled', 'disabled');
                    btn8.attr('disabled', 'disabled');
                    btn9.attr('disabled', 'disabled');
                }
            });
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
            winExt2.prototype.center = function() { // 重写父类的方法
                alert('重写了父类居中方法，然后再调用父类居中方法');
                this.parent.center.call(this); // 调用父类方法，需要强制指定作用域
            };

            var we2 = new winExt2({
                afterDestory: function() {
                    btn10.attr('disabled', 'disabled');
                    btn11.attr('disabled', 'disabled');
                    btn12.attr('disabled', 'disabled');
                }
            });
            we2.init();

            btn10.click(function() {
                we2.render();
            });
            btn11.click(function() {
                we2.unrender();
            });
            btn12.click(function() {
                we2.destory();
            });
        })();

        /**--------------------------------------------
         * 实例3： 已有节点上组件处理
         * --------------------------------------------*/
        (function() {
            var tabview = widget.create({
                events: [
                    {
                        active: function(e) {
                            this.active($(e.target));
                        }
                    }
                ],
                proto: {
                    active: function(node) {
                        var contentNode = this.element.find('.tab-content').eq(0);
                        var preNode = this.element.find('li.active');
                        if(preNode[0] != node[0]) {
                            var type = node.attr('data-type');
                            preNode.removeClass('active');
                            node.addClass('active');
                            if(type == 'literature') {
                                contentNode.html('鸡鸡复鸡鸡，木兰当户织');
                            } else if(type == 'sports') {
                                contentNode.html('曼联再次崛起');
                            } else if(type == 'political') {
                                contentNode.html('所有政治家都是骗子');
                            }
                        }

                    }
                }
            });

            var t1 = new tabview({
                element: $('#tabview')
            });
            t1.init().render();

            var t2 = new tabview({
                element: $('#tabview2')
            });
            t2.init().render();
        })();
    });
});
