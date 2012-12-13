define(function(require, exports, module) {
    require('../../../../../../sample.js');
    var $ = require('jquery');
    var ajax = require('../../../../../../../lib/util/core/ajax');
    var string = require('../../../../../../../lib/util/core/string');
    var upload = require('../../../../../../../lib/util/core/dom/html5/upload');
    var dragUpload = require('../../../../../../../lib/util/core/dom/html5/drag-upload');
    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var helper = {
                item: function(file, containerId) {
                    var name = file.name;
                    if(string.blength(name) > 20) {
                        name = string.cut(name, 10, true) + '...' + string.cut(name, 7, {
                            dir: 'right',
                            fullSharp: true
                        });
                    }
                    var html = '<div class="item" id="' + containerId + '_' + file.index + '" data-id="0">';
                    html += '<span class="progress"></span>';
                    html += '<p class="tip error"></p>';
                    html += '<p class="file-name">' + name + '</p>';
                    html += '</div>';
                    $('#' + containerId).next().next().append(html);
                },
                progress: function(file, loaded, total, containerId) {
                    $('#' + containerId + '_' + file.index).find('.progress').text((loaded / total * 100).toFixed(2) + '%');
                },
                tip: function(file, type, msg, containerId) {
                    var node = $('#' + containerId + '_' + file.index);
                    node.find('.progress').hide();
                    if(type == 'success') {
                        node.find('.tip').addClass('success').removeClass('error').text(msg || '上传成功');
                    } else if(type == 'failure') {
                        node.find('.tip').addClass('error').removeClass('success').text(msg || '上传失败');
                    }
                }
            };

            var u1 = new upload({ // 上传图片
                url: 'upload.php',
                fileName: '',
                fileType: '*.jpg; *.gif; *.png',
                max: 2,
                limit: 10,
                maxSize: '3M',
                zeroSize: function(file) {
                    helper.tip(file, 'failure', '空文件', 'container1');
                },
                overSize: function(file, size) {
                    helper.tip(file, 'failure', '文件太大', 'container1');
                },
                notAllowType: function(file) {
                    helper.tip(file, 'failure', '类型不允许', 'container1');
                },
                overLimit: function(limit) {
                    alert('超过数量限制：' + limit + '，不能再增加文件');
                }
            });

            $(u1).bind({
                successAdd: function(event, file, files) {
                    helper.item(file, 'container1');
                    upload.preview(file, function(file, result) {
                        $('#container1_' + file.index).prepend('<img src="' + result + '" width="100"/>');
                    });
                    u1.upload();
                },
                failureAdd: function(event, file, files) {
                    helper.item(file, 'container1');
                },
                progress: function(event, e, file, loaded, total) {
                    helper.progress(file, loaded, total, 'container1');
                },
                success: function(event, file, data) {
                    helper.tip(file, 'success', '上传成功', 'container1');
                },
                failure: function(event, file, data) {
                    helper.tip(file, 'failure', '上传失败', 'container1');
                },
                error: function(event, file, data) {

                },
                complete: function(event, file) {
                }
            });

            dragUpload.bind({
                drop: function(e, files) {
                    var target = e.target;
                    var node = $(target);
                    var p = document.getElementById('box3');
                    if(p && (target == p || node.parents('.box')[0] == p)) {
                        u3.add(files);
                    } else {
                        u1.add(files);
                    }
                }
            });

            $('#select_file1').change(function(e) {
                var files = this.files;
                u1.add(files);
            });

            $('#reset1').click(function() {
                u1.reset(function() {
                    $('#result1').html('');
                });
            });

            var url;
            var u2 = new upload({ // 上传文件
                url: url,
                fileName: '',
                fileType: '*',
                max: 1,
                limit: 3,
                maxSize: '5M',
                zeroSize: function(file) {
                    helper.tip(file, 'failure', '空文件', 'container2');
                },
                overSize: function(file, size) {
                    helper.tip(file, 'failure', '文件太大', 'container2');
                },
                overLimit: function(limit) {
                    alert('超过数量限制：' + limit + '，不能再增加文件');
                }
            });

            $(u2).bind({
                successAdd: function(event, file, files) {
                    helper.item(file, 'container2');
                    if(url) {
                        u2.upload();
                    } else {
                        ajax.single('getUrl').send({
                            url: 'getUrl.php',
                            success: function(data) {
                                url = data.data;
                                u2.setUploadUrl(url);
                                u2.upload();
                                setTimeout(function() {
                                    url = null;
                                    u2.setUploadUrl(url);
                                }, 10000);
                            }
                        });
                    }
                },
                failureAdd: function(event, file, files) {
                    helper.item(file, 'container2');
                },
                progress: function(event, e, file, loaded, total) {
                    helper.progress(file, loaded, total, 'container2');
                },
                success: function(event, file, data) {
                    helper.tip(file, 'success', '上传成功', 'container2');
                },
                failure: function(event, file, data) {
                    helper.tip(file, 'failure', '上传失败', 'container2');
                },
                error: function(event, file, data) {

                },
                complete: function(event, file) {
                }
            });

            dragUpload.bind({
                node: document.getElementById('box2'),
                drop: function(e, files) {
                    u2.add(files);
                }
            });

            $('#select_file2').change(function(e) {
                var files = this.files;
                u2.add(files);
            });

            $('#reset2').click(function() {
                u2.reset(function() {
                    $('#result2').html('');
                });
            });

            var u3 = new upload({ // 上传文件
                url: 'upload.php',
                fileName: '',
                fileType: '*',
                max: 3,
                limit: 15,
                maxSize: '100M',
                zeroSize: function(file) {
                    helper.tip(file, 'failure', '空文件', 'container3');
                },
                overSize: function(file, size) {
                    helper.tip(file, 'failure', '文件太大', 'container3');
                },
                overLimit: function(limit) {
                    alert('超过数量限制：' + limit + '，不能再增加文件');
                }
            });

            $(u3).bind({
                successAdd: function(event, file, files) {
                    helper.item(file, 'container3');
                    u3.upload();
                },
                failureAdd: function(event, file, files) {
                    helper.item(file, 'container3');
                },
                progress: function(event, e, file, loaded, total) {
                    helper.progress(file, loaded, total, 'container3');
                },
                success: function(event, file, data) {
                    helper.tip(file, 'success', '上传成功', 'container3');
                },
                failure: function(event, file, data) {
                    helper.tip(file, 'failure', '上传失败', 'container3');
                },
                error: function(event, file, data) {

                },
                complete: function(event, file) {
                }
            });
            var html = '<div class="box" id="box3"><div class="container" id="container3">拖拽到这个div，上传</div><div class="bar"><input type="file" id="select_file3"  multiple="true"/><input id="reset3" type="button" value="清空"/></div><div class="upload-result" id="result3"></div></div>';
            $('#xbtn').click(function() {
                var box3 = $('#box3');
                var btn = $(this);
                if(box3[0]) {
                    u3.reset();
                    box3.remove();
                    btn.val('创建');
                } else {
                    $(this).after(html);
                    btn.val('销毁');
                    $('#select_file3').change(function(e) {
                        var files = this.files;
                        u3.add(files);
                    });

                    $('#reset3').click(function() {
                        u3.reset(function() {
                            $('#result3').html('');
                        });
                    });
                }
            });
        })();
    });
});
