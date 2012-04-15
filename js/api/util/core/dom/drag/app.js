define(function(require, exports, module) {
    require('../../../../api_page.js');
    var $ = require('../../../../../lib/jquery/1.7.1/sea_jquery.js');
    var drag = require('../../../../../lib/util/core/dom/drag.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag1')
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag2'),
                handle:'.handle'
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag3'),
                except:'.except'
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag4'),
                container:$('#box1')
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag5'),
                axisX:true
            });
            drag.reg({
                node:$('#drag6'),
                axisY:true
            });
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag7'),
                proxy:'dashed'
            });
            drag.reg({
                node:$('#drag8'),
                proxy:true
            });
            drag.reg({
                node:$('#drag9'),
                proxy:function(node, handle) {
                    return '<div style="border: 1px solid #555;background: #ddd;">自定义内容</div>';
                }
            });
        })();

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        (function() {
            drag.reg({
                node:$('#drag10'),
                scroll:true
            });
        })();

        /**--------------------------------------------
         * 实例8：
         * --------------------------------------------*/
        (function() {
            var box2 = $('#box2');
            var list = box2.find('.drag');
            list.find(':checkbox').click(function() {
                if(this.checked) {
                    $(this).parents('.drag').addClass('selected');
                } else {
                    $(this).parents('.drag').removeClass('selected');
                }
            }).removeAttr('checked');
            drag.reg({
                node:list,
                multi: function() {
                    return box2.find('.selected');
                }
            });

            /**--------------------------------------------
             * 实例9：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node:$('#drag14'),
                    grid:50
                });
            })();

            /**--------------------------------------------
             * 实例10：
             * --------------------------------------------*/
            (function() {
                drag.reg({
                    node:$('#drag15'),
                    offset: {
                        top:50,
                        left:50
                    }
                });
            })();

/*            (function() {
                drag.reg({
                    node:$('#drag14'),
                    dragstart: function() {
                        console.log('dragstart');
                    },
                    drag: function() {
                        console.log('drag');
                    },
                    drop: function() {
                        console.log('drop');
                    },
                    dragend: function() {
                        console.log('dragend');
                    }
                });
            })();*/

        })();
    });
});
