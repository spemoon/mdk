define(function (require, exports, module) {
    require('../../../../../../sample.js');
    var $ = require('jquery');
    var xload = require('../../../../../../../lib/util/core/dom/html5/upload-facade');
    var string = require('../../../../../../../lib/util/core/string');
    $(function () {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function () {
            var helper = {
                item: function(file, msg) {
                    var name = file.name;
                    msg = msg || '';
                    if(string.blength(name) > 20) {
                        name = string.cut(name, 10, true) + '...' + string.cut(name, 7, {
                            dir: 'right',
                            fullSharp: true
                        });
                    }
                    var html = '<div class="item" id="upfile_' + file.index + '" data-id="0">';
                    html += '<span class="progress"></span>';
                    html += '<p class="tip error">' + msg + '</p>';
                    html += '<p class="file-name">' + name + '</p>';
                    html += '</div>';
                    $('#result').append(html);
                },
                progress: function(file, loaded, total) {
                    $('#upfile_' + file.index).find('.progress').text((loaded / total * 100).toFixed(2) + '%');
                },
                tip: function(file, type, msg) {
                    var node = $('#upfile_' + file.index);
                    node.find('.progress').hide();
                    if(type == 'success') {
                        node.find('.tip').addClass('success').removeClass('error').text(msg || '上传成功');
                    } else if(type == 'failure') {
                        node.find('.tip').addClass('error').removeClass('success').text(msg || '上传失败');
                    }
                },
                result: function() {
                    var list = $('#result>.item');
                    var arr = [];
                    for(var i = 0, len = list.length; i < len; i++) {
                        var node = list.eq(i);
                        var id = node.attr('data-id');
                        if(id != 0) {
                            arr.push(id);
                        }
                    }
                    return arr;
                }
            };

            var x = new xload({
                url:'upload.php', // 服务端处理
                fileName:'', // 后端接收文件的域
                multi: true, // 是否允许一次性选择多个，默认true
                button:'btn', // 上传的按钮id字符串
                image:'http://mdk.js/themes/default/images/upload/btn.png', // 背景图片设置
                fileType:'*.jpg;*.gif', // 文件类型，默认*
                limit:5, // 文件数量限制
                maxSize:'2M', // 文件大小限制，b/k/m/g/t为单位的字符串
                data:{ // 附加post参数
                    d1:11,
                    d2:'22d2'
                },
                overLimit:function (limit) { // 超过数量限制的回调
                    alert('超过' + limit + '数量限制');
                },
                overSize:function (size, file) { // 超过文件大小的限制的回调
                    helper.item(file, '超过' + size + '大小限制');
                },
                zeroSize:function (file) { // 0字节文件回调
                    helper.item(file, '空文件');
                },
                notAllowType:function (file) {
                    helper.item(file, '文件类型不允许');
                },
                successAdd:function (file) {
                    helper.item(file);
                },
                failureAdd:function (file) {
                    //console.log('failure add');
                },
                progress:function (file, loaded, total) {
                    helper.progress(file, loaded, total);
                },
                success:function (file, data) {
                    helper.tip(file, 'success');
                    data = data.data;
                    $('#upfile_' + file.index).attr('data-id', data.id);
                },
                failure:function (file, data) {
                    helper.tip(file, 'failure');
                },
                finish:function (file) {
                    //console.log('finish:', file);
                },
                complete:function (file) {
                    //console.log('complete');
                }
            });

            $('#reset').click(function () {
                x.reset();
                $('#result').html('');
            });
            $('#disable').click(function () {
                x.disable();
            });
            $('#enable').click(function () {
                x.enable();
            });
            $('#submit').click(function() {
                var arr = helper.result();
                alert('提交图片id：' + arr);
                x.reset();
                $('#result').html('');
            });
        })();
    });
});
