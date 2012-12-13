define(function(require, exports, module) {
    require('../../../../../../sample.js');
    var $ = require('jquery');
    var string = require('../../../../../../../lib/util/core/string');
    var upload = require('../../../../../../../lib/util/core/dom/html5/upload');
    var dragUpload = require('../../../../../../../lib/util/core/dom/html5/drag-upload');
    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
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
                }
            };

            var u1 = new upload({
                url: 'upload.php',
                fileName: '',
                fileType: '*.jpg; *.gif; *.png',
                max: 2,
                limit: 10,
                maxSize: '3M',
                zeroSize: function(file) {
                    helper.tip(file, 'failure', '空文件');
                },
                overSize: function(file, size) {
                    helper.tip(file, 'failure', '文件太大');
                },
                notAllowType: function(file) {
                    helper.tip(file, 'failure', '类型不允许');
                },
                overLimit: function(limit) {
                    alert('超过数量限制：' + limit + '，不能再增加文件');
                }
            });

            $(u1).bind({
                successAdd: function(event, file, files) {
                    helper.item(file);
                    upload.preview(file, function(file, result) {
                        $('#upfile_' + file.index).prepend('<img src="' + result + '" width="150"/>');
                    });
                    u1.upload();
                },
                failureAdd: function(event, file, files) {
                    helper.item(file);
                },
                progress: function(event, e, file, loaded, total) {
                    helper.progress(file, loaded, total);
                },
                success: function(event, file, data) {
                    helper.tip(file, 'success', '上传成功');
                },
                failure: function(event, file, data) {
                    helper.tip(file, 'failure', '上传失败');
                },
                error: function(event, file, data) {

                },
                complete: function(event, file) {
                }
            });

            dragUpload.bind({
                drop: function(e, files) {
                    u1.add(files);
                }
            });

            $('#select_file').change(function(e) {
                var files = this.files;
                u1.add(files);
            });

            $('#reset').click(function() {
                u1.reset(function() {
                    $('#result').html('');
                });
            });

        })();
    });
});
