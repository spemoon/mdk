define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');

    var helper = {
        getCssPrefix: (function() {
            var prefix = false; // 前缀类型,false表示不支持
            return function() {
                var node = document.createElement('div');
                if(typeof node.style.MozTransform !== 'undefined') {
                    prefix = 'Moz';
                } else if(typeof node.style.webkitTransform !== 'undefined') {
                    prefix = 'webkit';
                } else if(typeof node.style.OTransform !== 'undefined') {
                    prefix = 'O';
                } else {
                    prefix = '';
                }
                return prefix;
            }
        })(),
        isSupportCanvas: (function() {
            var supportCanvas; // 是否支持canvas
            return function() {
                if(typeof supportCanvas == 'undefined') { // 确保只检测一次
                    supportCanvas = !!document.createElement('canvas').getContext;
                }
                return supportCanvas;
            }
        })()
    };

    var r = {
        /**
         * params
         *     url: 图片url，必须
         *     ready: 获取到图片宽高后的处理函数，必须
         *     load: 图片完全载入后的处理函数，可选，load肯定是在ready之后
         *     error: 获取图片失败后的处理函数，可选
         */
        load: (function() {
            var list = []; // 存放监听图片获取到大小的函数的队列
            var intervalId = null; // 用来执行队列
            /**
             * 提供给setInterval来执行list中的函数
             */
            var tick = function() {
                for(var i = 0; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            };
            /**
             * 停止所有定时器队列
             */
            var stop = function() {
                clearInterval(intervalId);
                intervalId = null;
            };

            return function(params) {
                var onready; // 获取图片大小的函数
                var width; // 图片宽
                var height; // 图片高
                var newWidth; // 用来比较的图片宽
                var newHeight; // 用来比较的图片高
                var img = new Image(); // 图片对象

                img.src = params.url;

                // 如果图片被缓存，则直接返回缓存数据
                if(img.complete) {
                    params.ready.call(img);
                    params.load && params.load.call(img);
                } else {
                    width = img.width; // 初始化宽度
                    height = img.height; // 初始化高度

                    // 加载错误后的事件
                    img.onerror = function() {
                        params.error && params.error.call(img);
                        onready.end = true;
                        img = img.onload = img.onerror = null;
                    };

                    // 图片尺寸就绪
                    onready = function() {
                        newWidth = img.width;
                        newHeight = img.height;
                        if(newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {// 如果图片已经在其他地方加载可使用面积检测
                            params.ready.call(img);
                            onready.end = true;
                        }
                    };
                    onready();

                    // 完全加载完毕的事件
                    img.onload = function() {
                        !onready.end && onready(); // onload在定时器时间差范围内可能比onready快，这里进行检查并保证onready优先执行
                        params.load && params.load.call(img);
                        img = img.onload = img.onerror = null;// IE gif动画会循环执行onload，置空onload即可
                    };

                    // 加入队列中定期执行
                    if(!onready.end) {
                        list.push(onready);
                        if(intervalId === null) { // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                            intervalId = setInterval(tick, 40);
                        }
                    }
                }
            };
        })(),
        /**
         * 缩放图片
         * @param params
         *     node: 图片对象
         *     max: 图片最大尺寸（宽或高），可选
         *     maxWidth: 图片最大宽度，优先级大于max，缺省是max，可选
         *     maxHeight: 图片最大高度，优先级大于max，缺省是max，可选
         *     overflow: 是否允许图片超出max范围，true允许，即按短边缩放，其他标识按长边缩放（默认值），可选
         *     callback: 回调
         * @return {Object}
         *     width: 缩放后的宽
         *     height: 缩放后的高
         */
        zoom: function(params) {
            var image = params.node[0] || params.node;
            var width = image.width;
            var height = image.height;
            var maxWidth = params.maxWidth || params.max;
            var maxHeight = params.maxHeight || params.max;
            var overflow = params.overflow === true;
            if(width > maxWidth || height > maxHeight) {
                if(overflow) { // 根据短边缩放
                    if(width > height) {
                        width /= height / maxHeight;
                        height = maxHeight;
                    } else {
                        height /= width / maxWidth;
                        width = maxWidth;
                    }
                } else { // 根据长边缩放，这是常用情况
                    if(width > height) {
                        height /= width / maxWidth;
                        width = maxWidth;
                    } else {
                        width /= height / maxHeight;
                        height = maxHeight;
                    }
                }
            }

            params.callback && params.callback.call(image, width, height);

            return {
                width: width,
                height: height
            };
        },

        /**
         * 让图片居中
         * @param params
         *     node: 图片节点
         *     height: 容器高度
         *     width: 容器宽度
         *     callback: 回调
         * @return {Object}
         */
        center: function(params) {
            var image = params.node[0] || params.node;
            var top = (params.height - image.height) / 2;
            var left = (params.width - image.width) / 2;

            params.callback && params.callback.call(image, top, left);

            return {
                top: top,
                left: left
            };
        },

        rotate: function(params) {
            var image = params.node[0] || params.node;
            var node = $(image);
            var dir = params.dir;
            var degree;
            var prefix = helper.getCssPrefix();
            if(typeof image.degree == 'undefined') {
                image.degree = 0;
                if(params.animate !== false) {
                    if(prefix !== false) {
                        if(prefix) {
                            image.style[prefix + 'Transition'] = '-' + prefix.toLowerCase() + '-transform .2s ease-in';
                        } else {
                            image.style.transition = 'transform .2s ease-in';
                        }
                    }
                }
            }
            degree = image.degree;
            if(dir === true) { // 逆时针
                degree -= 90;
            } else { // 顺时针
                degree += 90;
            }
            image.degree = degree;

            if(prefix !== false || helper.isSupportCanvas()) {
                if(params.center !== false) {
                    var str = 'rotate(' + degree + 'deg)';
                    if(prefix) {
                        image.style[prefix + 'Transform'] = str;
                    } else {
                        image.style.transform = str;
                    }
                } else {
                    var canvas = node.next('canvas').eq(0)[0];
                    if(!canvas) {
                        canvas = document.createElement('canvas');
                        canvas.style.position = image.style.position;
                        $(image).after(canvas);
                    }
                    var ctx = canvas.getContext('2d');
                    var width = image.width;
                    var height = image.height;
                    var x = 0;
                    var y = 0;
                    var temp = degree % 360 + 360;
                    switch(temp) {
                        case 90:
                            width = image.height;
                            height = image.width;
                            y = image.height * (-1);
                            break;
                        case 180:
                            x = image.width * (-1);
                            y = image.height * (-1);
                            break;
                        case 270:
                            width = image.height;
                            height = image.width;
                            x = image.width * (-1);
                            break;
                    }
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    ctx.rotate(degree * Math.PI / 180);
                    ctx.drawImage(image, x, y);
                    image.style.display = 'none';
                }
                params.callback && params.callback.call(image);
            } else {
                image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + degree / 90 + ')';
                params.callback && params.callback.call(image);
            }
        }
    };
    return r;
});