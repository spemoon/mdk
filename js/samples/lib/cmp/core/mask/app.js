define(function(require, exports, module) {
    require('../../../../sample.js');
    var $ = require('../../../../../../js/lib/jquery/sea_jquery.js');
    var mVar = require('../../../../../lib/util/core/dom/mVar.js');
    var mask = require('../../../../../lib/cmp/core/mask.js');
    var widget = require('../../../../../lib/cmp/widget.js');

    var helper = {
        random: function(n) {
            n = n || 800;
            return Math.ceil(Math.random() * n);
        }
    };

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            btn1.click(function() {
                var m1 = new mask();
                m1.init().render('hello');
                setTimeout(function() {
                    m1.unrender();
                }, 3000);
            });
            btn2.click(function() {
                var m1 = new mask();
                m1.init().render('');
                setTimeout(function() {
                    m1.unrender();
                }, 3000);
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            var btn3 = $('#btn3');
            var cmp = widget.create({
                autoDestory: true,
                tpl: function() {
                    var html = '';
                    html += '<div class="cmp-sample">';
                    html += '    <input type="button" value="点击我再来一个遮罩" data-action="open"/>';
                    html += '    <input type="button" value="关闭自己" data-action="close"/>';
                    html += '</div>';
                    return html;
                },
                beforeRender: function() {
                    this.mask = new mask();
                    this.mask.init().render();
                },
                afterRender: function() {
                    this.element.css({
                        top: helper.random(500),
                        left: helper.random(768),
                        zIndex: mVar.zIndex()
                    });
                },
                afterDestory: function() {
                    this.mask.destory();
                },
                proto: {
                    unrender: function() {
                        this.mask.unrender();
                        this._unrender();
                        return this;
                    }
                },
                events: [
                    {
                        open: function() {
                            var c = new cmp();
                            c.init().render();
                        }
                    },
                    {
                        close: function() {
                            this.unrender();
                        }
                    }
                ]
            });

            btn3.click(function() {
                var c = new cmp();
                c.init().render();
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var m1 = new mask({
                renderTo: $('#mask_box')
            });
            btn4.removeAttr('disabled');
            btn4.click(function() {
                m1.init().render('hello');
                btn4.attr('disabled', 'disabled');
            });
            btn5.click(function() {
                m1.unrender();
                btn4.removeAttr('disabled');
            });
        })();
    });
});
