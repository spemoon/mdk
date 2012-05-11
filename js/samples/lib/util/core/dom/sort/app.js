define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var sort = require('../../../../../../lib/util/core/dom/sort.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box1'),
                item: 'li'
            });
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box2'),
                item: 'li'
            });
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box3'),
                item: 'li'
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function() {
            sort.reg({
                node: $('#box4'),
                item: 'li',
                handle: 'span'
            });
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function() {
            var box5 = $('#box5');
            sort.reg({
                node: box5,
                item: 'li',
                filter: function(item, i, items, node) {
                    var flag = item.find(':checkbox').eq(0)[0].checked;
                    return flag ? 0 : true;
                }
            });
            box5.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('li').addClass('disabled');
                    } else {
                        $(this).parents('li').removeClass('disabled');
                    }
                }).removeAttr('checked');
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function() {
            var box6 = $('#box6');
            sort.reg({
                node: box6,
                item: 'li',
                filter: function(item, i, items, node) {
                    return !item.find(':checkbox').eq(0)[0].checked;
                }
            });
            box6.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('li').addClass('disabled');
                    } else {
                        $(this).parents('li').removeClass('disabled');
                    }
                }).removeAttr('checked');
        })();

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        (function() {
            var box7 = $('#box7');
            var box8 = $('#box8');

            sort.reg({
                node: box7,
                item: 'li',
                connect: box8
            });
            sort.reg({
                node: box8,
                item: 'li',
                connect: box7
            });
        })();

        /**--------------------------------------------
         * 实例8：
         * --------------------------------------------*/
        (function() {
            var box9 = $('#box9');
            var box10 = $('#box10');
            var box11 = $('#box11');

            sort.reg({
                node: box9,
                item: 'li',
                connect: $('#box10, #box11'),
                filter: function(item, i, items) {
                    var flag = item.find(':checkbox').eq(0)[0];
                    if(flag && flag.checked) {
                        flag = 0;
                    } else {
                        flag = true;
                    }
                    return flag;
                }
            });
            sort.reg({
                node: box10,
                item: 'li',
                connect: box11
            });
            sort.reg({
                node: box11,
                item: 'li',
                connect: box9
            });

            box9.find(':checkbox').click(
                function() {
                    if(this.checked) {
                        $(this).parents('li').addClass('disabled');
                    } else {
                        $(this).parents('li').removeClass('disabled');
                    }
                }).removeAttr('checked');
        })();

        /**--------------------------------------------
         * 实例9：
         * --------------------------------------------*/
        (function() {
            var box12 = $('#box12');
            var box13 = $('#box13');

            sort.reg({
                node: box12,
                item: 'li',
                connect: box13
            }).bind({
                    dragstart: function(e, placeholder, mouse, handle, node, target, position) {
                        console.log('dragstart');
                    },
                    placeholder: function(e, placeholder, container, i, index, mouse, handle, node, target, position) {
                        placeholder.css({
                            border: '1px solid blue',
                            background: '#fff',
                            visibility: 'visible'
                        });
                        console.log('placeholder');
                    },
                    dragend: function(e, mouse, handle, node, position) {
                        console.log('dragend');
                    }
                });
            sort.reg({
                node: box13,
                item: 'li',
                connect: box12
            });
        })();

        /**--------------------------------------------
         * 实例10：
         * --------------------------------------------*/
        (function() {
            var cookie = require('../../../../../../lib/util/core/bom/cookie.js');
            var col = [$('#col1'), $('#col2'), $('#col3')];
            var data = [
                {cls: 'min', text: '床前明月光', pos: [0, 0]},
                {cls: 'mid', text: '疑是地上霜', pos: [0, 1]},
                {cls: 'max', text: '举头望明月', pos: [0, 2]},
                {cls: 'mid', text: '低头思故乡', pos: [1, 0]},
                {cls: 'max', text: '离离原上草', pos: [1, 1]},
                {cls: 'min', text: '一岁一枯荣', pos: [1, 2]},
                {cls: 'max', text: '野火烧不尽', pos: [2, 0]},
                {cls: 'min', text: '春风吹又生', pos: [2, 1]},
                {cls: 'mid', text: '！！！！！', pos: [2, 2]}
            ];
            (function(portlet) {
                if(portlet) {
                    portlet = portlet.split('_');
                    for(var i = 0, len = portlet.length; i < len; i++) {
                        data[i].pos = portlet[i].split(',');
                    }
                }
            })(cookie.get('portlet'));
            var createItem = function(config) {
                return '<div class="col-content col-content-' + config.cls + '">' + config.text + '</div>';
            };
            var placeholderShow = function(placeholder) {
                placeholder.css({
                    border: '2px dashed #ddd',
                    background: '#fff',
                    visibility: 'visible'
                });
            };
            var sortAction = function(node, connect) {
                sort.reg({
                    node: node,
                    item: '.col-content',
                    connect: connect
                }).bind({
                        dragstart: function(e, placeholder, mouse, handle, node, target, position) {
                            placeholderShow(placeholder);
                        },
                        placeholder: function(e, placeholder, container, i, index, mouse, handle, node, target, position) {
                            placeholderShow(placeholder);
                        }
                    });
            };
            var buildView = function(data) {
                for(var i = 0; i < data.length; i++) {
                    for(var j = 0; j < data[i].length; j++) {
                        col[i].append('<div class="col-content col-content-' + data[i][j] + '"></div>');
                    }
                }
            };

            buildView(data);
            sortAction(col[0], $('#col2, #col3'));
            sortAction(col[1], $('#col1, #col3'));
            sortAction(col[2], $('#col1, #col2'));
        })();
    });
});
