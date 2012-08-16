define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var drag = require('../../../../../../lib/util/core/dom/drag.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag1')
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag2'),
                handle: '.handle'
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag3'),
                except: '.except'
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag4'),
                container: $('#box1')
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag5'),
                axisX: true
            });
            drag.reg({
                node: $('#drag6'),
                axisY: true
            });
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag7'),
                proxy: 'dashed'
            });
            drag.reg({
                node: $('#drag8'),
                proxy: true
            });
            drag.reg({
                node: $('#drag9'),
                proxy: function(node, handle) {
                    return '<div style="border: 1px solid #555;background: #ddd;">自定义内容</div>';
                }
            });
        })();

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node: $('#drag10'),
                scroll: true
            });
        })();

        /**--------------------------------------------
         * 实例8：
         * --------------------------------------------*/
        (function() {
            var box2 = $('#box2');
            var list = box2.find('.drag');
            list.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('.drag').addClass('selected');
                    } else {
                        $(this).parents('.drag').removeClass('selected');
                    }
                }).removeAttr('checked');
            drag.reg({
                node: list,
                multi: function() {
                    return box2.find('.selected');
                }
            });

            /**--------------------------------------------
             * 实例9：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node: $('#drag14'),
                    grid: 50
                });
            })();

            /**--------------------------------------------
             * 实例10：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node: $('#drag15'),
                    offset: {
                        top: 50,
                        left: 50
                    }
                });
            })();

            /**--------------------------------------------
             * 实例11：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node: $('#drag16'),
                    target: $('#box3')
                }).bind({
                        drop: function(e, mouse, container, handle, node, target, position) {
                            container.css({
                                background: 'red'
                            }).text('dropped');
                        }
                    });
            })();

            /**--------------------------------------------
             * 实例12：
             * --------------------------------------------*/
            (function() {
                var box4 = $('#box4');
                drag.reg({
                    node: $('#drag17'),
                    target: box4
                }).bind({
                        dragstart: function(e, mouse, handle, node, target, position) {
                            box4.text('dragstart');
                        },
                        drag: function(e, mouse, handle, node, target, position) {
                            box4.text('drag---pageX:' + mouse.pageX + ',pageY:' + mouse.pageY);
                        },
                        dragenter: function(e, mouse, container, handle, node, target, position) {
                            container.css('background', 'green').text('dragenter');
                            console.log('dragenter');
                        },
                        dragover: function(e, mouse, container, handle, node, target, position) {
                            container.css('background', 'yellow').text('dragover');
                        },
                        dragleave: function(e, mouse, container, handle, node, target, position) {
                            container.css('background', '').text('dragleave');
                            console.log('dragleave');
                        },
                        drop: function(e, mouse, container, handle, node, target, position) {
                            container.css('background', 'red').text('dropped');
                        },
                        dragend: function(e, mouse, handle, node, position) {
                            console.log('dragend');
                        }
                    });
            })();

            /**--------------------------------------------
             * 实例13：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node: $('#drag18')
                });
            })();

            /**--------------------------------------------
             * 实例14：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node: $('#drag19'),
                    target: $('#box5'),
                    revert: true
                });

                drag.reg({
                    node: $('#drag20'),
                    target: $('#box5'),
                    revert: true,
                    animate: true
                });
            })();

            /**--------------------------------------------
             * 实例15：
             * --------------------------------------------*/
            (function() {
                var drag21 = $('#drag21');
                var checkbox = drag21.find(':checkbox').eq(0);
                checkbox.removeAttr('checked');
                drag.reg({
                    node: drag21
                });
                checkbox.click(function() {
                    if(this.checked) {
                        drag.unreg(drag21);
                    } else {
                        drag.reg({
                            node: drag21
                        });
                    }
                });
            })();

            /**--------------------------------------------
             * 实例16：
             * --------------------------------------------*/
            (function() {
                var drag22 = $('#drag22');
                var text22 = $('#text22');
                drag.reg({
                    node: drag22,
                    beforeDrag: function() {
                        var flag = +new Date % 3 != 0;
                        text22.text(flag ? '可以拖拽' : '不能拖拽');
                        return flag;
                    }
                });
            })();
        })();
    });
});
