define(function(require, exports, module) {
    require('../../../sample.js');
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');
    var widget = require('../../../../lib/cmp/widget.js');
    var drag = require('../../../../lib/util/core/dom/drag.js');
    var resize = require('../../../../lib/util/core/dom/resize.js');

    $(function() {
        /**--------------------------------------------
         * 实例1： 构建一个window弹出层基类
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var win = widget.create({
                tpl: function() {
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
                    html += '                        <td><div class="header">' + (this.title || '{header}') + '<a href="#" data-action="close" class="close">X</a></div></td>';
                    html += '                    </tr>';
                    html += '                    <tr>';
                    html += '                        <td class="content">{content}</td>';
                    html += '                    </tr>';
                    html += '                    <tr>';
                    html += '                        <td class="footer">{footer}</td>';
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
                afterInit: function() {
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
                afterRender: function() {
                    this.center();
                },
                afterDestory: function() {

                },
                events: [{
                    close: function(e) {
                        this.unrender();
                    }
                }],
                proto: {
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

            var w1 = new win({
                title: 'hello',
                minHeight: 100
            });

            btn1.click(function() {
                w1.render();
            });
            btn2.click(function() {
                w1.unrender();
            });
            btn3.click(function() {
                w1.destory();
            });



            var winExt = widget.create({
                extend: win
            });

            var w2 = new winExt();
            w2.render();
        })();
    });
});
