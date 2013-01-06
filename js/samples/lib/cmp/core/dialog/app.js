define(function (require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var lang = require('../../../../../lib/util/core/lang');
    var dialog = require('../../../../../lib/cmp/core/dialog');

    var helper = {
        random:function (n) {
            n = n || 800;
            return Math.ceil(Math.random() * n);
        }
    };

    $(function () {
        /**--------------------------------------------
         * 实例1：简单弹窗提示
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn1');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world'
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();

        /**--------------------------------------------
         * 实例2：没有遮罩
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn2');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            mask: false
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();

        /**--------------------------------------------
         * 实例3：不可拖拽
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn3');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            drag: false
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();

        /**--------------------------------------------
         * 实例4：不可resize
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn4');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            resize: false
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();

        /**--------------------------------------------
         * 实例4：自定义位置
         * --------------------------------------------*/
        (function () {
            var btn5 = $('#btn5');
            var btn6 = $('#btn6');
            var d;
            btn5.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            drag: false,
                            resize: false,
                            mask: false
                        }
                    });
                    d.init();
                }
                d.render().setPosition({
                    top: 'bottom',
                    left: 'right'
                });
            });
            btn6.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            drag: false,
                            resize: false,
                            mask: false
                        }
                    });
                    d.init();
                }
                d.render().setPosition({
                    top: 200,
                    left: 200
                });
            });
        })();


        /**--------------------------------------------
         * 实例5：自定义按钮
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn7');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            buttons: [{
                                text: '我是禁用状态',
                                disable: true,
                                action: function(e, btn) {
                                    this.disableBtn(this.buttons[0], function(node, btn) {
                                        node.text('我又被禁用了');
                                    });
                                }
                            }, {
                                text: '启用左边按钮',
                                focus: true,
                                action: function(e, btn) {
                                    this.enableBtn(this.buttons[0], function(node, btn) {
                                        node.text('我被启用了');
                                    });
                                }
                            }, {
                                text: '窗口移动到左上角',
                                action: function(e, btn) {
                                    this.setPosition({
                                        top: 'top',
                                        left: 'left'
                                    });
                                }
                            }, {
                                text: '点完按钮后3秒后移除自身',
                                action: function(e, btn) {
                                    var target = e.target;
                                    var node = $(target);

                                    var i = 4;
                                    lang.timer({
                                        fn:function() {
                                            node.text(i + '秒后移除');
                                        },
                                        rule:function() {
                                            return i-- > 1;
                                        },
                                        step:1000,
                                        scope:this,
                                        end:function() {
                                            this.delBtn(btn);
                                        }
                                    });
                                }
                            }, {
                                text: '关闭',
                                action: 'close'
                            }]
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();

        /**--------------------------------------------
         * 实例6：没有底部
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn8');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            bar: false
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();

        /**--------------------------------------------
         * 实例6：载入内容
         * --------------------------------------------*/
        (function () {
            var btn = $('#btn9');
            var d;
            btn.click(function () {
                if (!d) {
                    d = new dialog({
                        params:{
                            title:'hello',
                            content:'world',
                            buttons: [{
                                text: '静态内容',
                                action: function(e, btn) {
                                    var str = '<p>-------------------------------------------------------------------------------------------------------------</p>';
                                    var c = '<p>人生若只如初见，何事秋风悲画扇，等闲变却故人心，却道故人心易变！ </p>' + str + '<p>骊山语罢清宵半，泪雨零铃终不怨。何如薄幸锦衣郎，比翼连枝当日愿。</p>' + str;
                                    var arr = new Array(10);
                                    this.setContent({
                                        content: arr.join(c)
                                    });
                                }
                            }, {
                                text: 'ajax载入',
                                action: function(e, btn) {
                                    this.setContent({
                                        type: 'ajax',
                                        url: 'data.php',
                                        success: function(data, node) {
                                            node.html(data.data);
                                        }
                                    });
                                }
                            }, {
                                text: '关闭',
                                action: 'close'
                            }]
                        }
                    });
                    d.init();
                }
                d.render();
            });
        })();


        /**--------------------------------------------
         * 实例7：常用提示窗
         * --------------------------------------------*/
        (function () {
            var btn10 = $('#btn10');
            var btn11 = $('#btn11');
            var btn12 = $('#btn12');
            var btn13 = $('#btn13');
            var btn14 = $('#btn14');
            var btn15 = $('#btn15');
            var btn16 = $('#btn16');
            var btn17 = $('#btn17');
            var d = new dialog({
                params: {
                    mask: false
                }
            });
            d.init();
            btn10.click(function () {
                d.alert({
                    title: 'alert',
                    content: 'alert'
                });
            });
            btn11.click(function () {
                d.alert({
                    title: 'alert',
                    content: 'alert callback',
                    button: {
                        text: 'click',
                        action: function(e, btn) {
                            alert(123);
                            this.unrender();
                        }
                    }
                });
            });

            btn12.click(function () {
                d.confirm({
                    title: 'confirm',
                    content: 'confirm',
                    ok: {
                        text: '确定',
                        action: function(e, btn) {
                            alert('点击了确定');
                            this.unrender();
                        }
                    }
                });
            });

            btn13.click(function () {
                d.prompt({
                    title: 'prompt',
                    tip: '请输入：',
                    val: 'hello world',
                    ok: {
                        text: '确定',
                        action: function(e, btn, val) {
                            alert(val);
                        }
                    }
                });
            });


            btn14.click(function(e) {
                d.render({
                    title: '打开则ajax载入',
                    width: 200,
                    buttons: [{
                        text: '切换成无bar',
                        action: function() {
                            d.render({
                                bar: false
                            });
                        }
                    }],
                    type: 'ajax',
                    url: 'data.php',
                    success: function(data, node) {
                        node.html(data.data);
                    }
                });
            });

            btn15.click(function(e) {
                d.alert({
                    title: 'success alert',
                    icon: 'success',
                    content: '确认要删除这条微博么？'
                });
            });

            btn16.click(function(e) {
                d.confirm({
                    title: 'success confirm',
                    icon: 'question',
                    content: '确认要删除这条微博么？',
                    ok: {
                        text: '要删除',
                        action: function(e) {
                            alert('----');
                            this.unrender();
                        }
                    }
                });
            });
        })();
    });
});
