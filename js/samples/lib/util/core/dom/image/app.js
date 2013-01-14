define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var image = require('../../../../../../lib/util/core/dom/image.js');

    $(function() {
        var helper = {
            imageWithoutCache: function(url) {
                url = $.trim(url);
                if(url.indexOf('?') == -1) {
                    url += '?t=';
                } else {
                    url += '&t=';
                }
                url += +new Date;
                return url;
            },
            normalLoad: function(params) {
                var img = new Image();
                img.src = params.url;
                if (img.complete) {
                    params.load.call(img);
                } else {
                    img.onload = function () {
                        params.load.call(img);
                        img = img.onload = img.onerror = null;
                    };
                    img.onerror = function () {
                        params.error.call(img);
                        img = img.onload = img.onerror = null;
                    };
                }
            },
            show: function(imageBox, img, url, overflow) {
                var boxWidth = imageBox.width();
                var boxHeight = imageBox.height();
                overflow = !!overflow;
                image.zoom({
                    node: img,
                    maxWidth: boxWidth,
                    maxHeight: boxHeight,
                    overflow: overflow,
                    callback: function(width, height) {
                        imageBox.html('<img src="' + url + '" width="' + width + '" height="' + height + '"/>');
                        image.center({
                            node: imageBox.find('img').eq(0),
                            width: boxWidth,
                            height: boxHeight,
                            callback: function(top, left) {
                                var node = $(this);
                                var css = {
                                    top: top + parseFloat(imageBox.css('padding-top')),
                                    left: left + parseFloat(imageBox.css('padding-left')),
                                    position: 'absolute'
                                };
                                node.css(css);
                            }
                        });
                    }
                });
            }
        };

        /**--------------------------------------------
         * 实例1： 单图载入
         * --------------------------------------------*/
        (function() {
            var btn1 = $('#btn1');
            var imgUrl1 = $('#img_url1');
            var readyTime = $('#ready_time');
            var loadTime = $('#load_time');
            var imgBox1 = $('#img_box1');
            var status = $('#status');

            btn1.click(function() {
                var url = helper.imageWithoutCache(imgUrl1.val());
                readyTime.text('');
                loadTime.text('');
                status.text('正在载入...');
                imgBox1.html('');

                var start = +new Date;
                image.load({
                    url: url,
                    ready: function() {
                        readyTime.text((+new Date) - start + ' ms，图片宽：' + this.width + '，高：' + this.height);
                        status.text('获取到大小，继续载入...');
                        image.zoom({
                            node: this,
                            max: 200,
                            callback: function(width, height) {
                                imgBox1.html('<img src="' + url + '" width="' + width + '" height="' + height + '"/>');
                            }
                        });
                    },
                    load: function() {
                        loadTime.text((+new Date) - start + ' ms，图片宽：' + this.width + '，高：' + this.height);
                        status.text('载入成功');
                    },
                    error: function() {
                        status.text('载入失败');
                    }
                });
            });
        })();

        /**--------------------------------------------
         * 实例2： 多图载入
         * --------------------------------------------*/
        (function() {
            var imageList = [
                'http://www.dfqgy.com/UploadFiles/2012218134933200.jpg',
                'http://spaceresource.dadunet.com/artweb/20110307092907389.jpg',
                'http://pic4.sdnews.com.cn/NewsImg/2008/1/22/U2507P28T3D1885178F329DT20080121104957.jpg',
                'http://cimg2.163.com/education/2006/4/11/2006041114312008b0e.jpg',
                'http://m1.aboluowang.com/ent/data/uploadfile/201202/2012020215380780.jpg',
                'http://img208.poco.cn/mypoco/myphoto/20110116/21/54860814201101162117203744039468315_035.jpg'
            ];

            var imgList1 = $('#img_list1').children('li');
            var imgList2 = $('#img_list2').children('li');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');

            btn2.click(function(e) {
                $(imageList).each(function(i, v) {
                    var li = imgList1.eq(i);
                    var imageBox = li.find('.image-show').eq(0);
                    var status = li.find('.status').eq(0);
                    var url = helper.imageWithoutCache(v);
                    status.text('正在载入...');
                    image.load({
                        url: url,
                        ready: function() {
                            helper.show(imageBox, this, url);
                            status.text('获取到宽高，继续载入...');
                        },
                        load: function() {
                            status.text('载入完成');
                        },
                        error: function() {
                            status.text('载入失败');
                        }
                    });
                });
            });

            btn3.click(function(e) {
                $(imageList).each(function(i, v) {
                    var li = imgList2.eq(i);
                    var imageBox = li.find('.image-show').eq(0);
                    var status = li.find('.status').eq(0);
                    var url = helper.imageWithoutCache(v);
                    status.text('正在载入...');

                    helper.normalLoad({
                        url: url,
                        load: function() {
                            helper.show(imageBox, this, url);
                            status.text('载入完成');
                        },
                        error: function() {
                            status.text('载入失败');
                        }
                    })
                });
            });
        })();

        /**--------------------------------------------
         * 实例3： 图片缩放
         * --------------------------------------------*/
        (function() {
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');
            var imgUrl2 = $('#img_url2');
            var imgBox2 = $('#img_box2');

            btn4.click(function() {
                var url = helper.imageWithoutCache(imgUrl2.val());
                image.load({
                    url: url,
                    ready: function() {
                        helper.show(imgBox2, this, url);
                    },
                    error: function() {
                        imgBox2.html('载入失败');
                    }
                });
            });

            btn5.click(function() {
                var url = helper.imageWithoutCache(imgUrl2.val());
                image.load({
                    url: url,
                    ready: function() {
                        helper.show(imgBox2, this, url, true);
                    },
                    error: function() {
                        imgBox2.html('载入失败');
                    }
                });
            });
        })();

        /**--------------------------------------------
         * 实例4： 图片旋转
         * --------------------------------------------*/
        (function() {
            var btn6 = $('#btn6');
            var btn7 = $('#btn7');
            var btn8 = $('#btn8');
            var btn9 = $('#btn9');
            var rotateImgWrap1 = $('#rotate_img_wrap1');
            var rotateImgWrap2 = $('#rotate_img_wrap2');
            var url = 'http://ww1.sinaimg.cn/bmiddle/7fbd5c93gw1dv4bwg47y2j.jpg';
            var url2 = 'http://img208.poco.cn/mypoco/myphoto/20110116/21/54860814201101162117203744039468315_035.jpg';


            image.load({
                url: url,
                ready: function() {
                    image.zoom({
                        node: this,
                        max: Math.max(rotateImgWrap1.width(), rotateImgWrap1.height()),
                        callback: function(width, height) {
                            rotateImgWrap1.html('<img src="' + url + '" width="' + width + '" height="' + height + '"/>');
                        }
                    });

                    var img = rotateImgWrap1.find('img').eq(0);
                    btn6.click(function() {
                        image.rotate({
                            node: img,
                            center: false,
                            dir: true
                        });
                    });
                    btn7.click(function() {
                        image.rotate({
                            center: false,
                            node: img
                        });
                    });
                }
            });


            image.load({
                url: url2,
                ready: function() {
                    image.zoom({
                        node: this,
                        max: Math.min(rotateImgWrap2.width(), rotateImgWrap2.height()),
                        callback: function(width, height) {
                            rotateImgWrap2.html('<img src="' + url2 + '" width="' + width + '" height="' + height + '"/>');
                            image.center({
                                node: rotateImgWrap2.find('img').eq(0),
                                width: rotateImgWrap2.width(),
                                height: rotateImgWrap2.height(),
                                callback: function(top, left) {
                                    var node = $(this);
                                    var css = {
                                        top: top,
                                        left: left,
                                        position: 'absolute'
                                    };
                                    node.css(css);
                                }
                            });
                        }
                    });
                    var img = rotateImgWrap2.find('img').eq(0);
                    btn8.click(function() {
                        image.rotate({
                            node: img,
                            dir: true
                        });
                    });

                    btn9.click(function() {
                        image.rotate({
                            node: img
                        });
                    });
                }
            });

        })();
    });
});
