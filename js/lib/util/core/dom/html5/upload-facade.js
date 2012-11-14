define(function (require, exports, module) {
    /**
     * html5/swfupload上传的兼容模式
     */
    var $ = require('jquery');
    var lang = require('../../lang');
    var html5upload = require('./upload');
    var swfupload = require('./swfupload-my');

    var isSupportHTML5Upload = false;

    (function () {
        if (typeof XMLHttpRequest != 'undefined') {
            var xhr = new XMLHttpRequest();
            isSupportHTML5Upload = !!xhr.upload;
        }
    })();
    var config = {
        fileName: 'upfile',
        fileType: '*',
        limit: 10,
        maxSize: '5M',
        multi: true,
        width: 72,
        height: 23
    };

    var helper = {
        unit:function (str) {
            var s = $.trim(str.replace(/\d+/, '')).toLowerCase();
            var d = $.trim(str.replace(/\D/g, ''));
            var a = ['b', 'k', 'm', 'g', 't'];
            var n = 0;
            for (var i = 0, len = a.length; i < len; i++) {
                if (s == a[i]) {
                    n = i;
                    break;
                }
            }
            return d * Math.pow(1000, n);
        }
    };

    $('#upload_form1').submit(function () {
        $('#submit1')[0].disabled = true;
    });

    var upload;
    if (isSupportHTML5Upload) {
        /**
         * @param params
         *     url: 后端响应上传的url
         *     fileName: 后端接收文件的域
         *     multi: 是否允许一次性选择多个，默认true
         *
         *     button: 上传的按钮id字符串
         *
         *     fileType: 文件类型，默认*
         *     limit: 文件数量限制
         *     overLimit(limit): 超过数量限制的回调
         *     maxSize: 文件大小限制，b/k/m/g/t为单位的字符串
         *     overSize(size, file): 超过文件大小的限制的回调
         *     zeroSize(file): 0字节文件回调
         *     successAdd(file)
         *     failureAdd(file)
         *     progress(file, loaded, total)
         *     success(file, data)
         *     failure(file, data)
         *     finish(file)
         *     complete(file)
         *
         *     dragable: 支持拖拽上传
         *     container: 拖拽响应节点
         *     notAllowType:
         *     type: 上传方式
         */
        upload = function (params) {
            (function() {
                for(var key in config) {
                    if(lang.isUndefined(params[key])) {
                        params[key] = config[key];
                    }
                }
            })();
            var maxSize = helper.unit(params.maxSize);
            var _this = this;
            (function(params, scope) {
                for(var key in params) {
                    scope[key] = params[key];
                }
            })(params, this);
            this.obj = new html5upload({
                url:params.url,
                fileName:params.fileName || 'upfile',
                fileType:params.fileType,
                dragable: true,
                limit:params.limit,
                beforeAdd:function (file, files) {
                    var size = file.size;
                    var flag = true;
                    if (size == 0) {
                        flag = false;
                        params.zeroSize && params.zeroSize.call(_this.obj, file);
                    } else if (size > maxSize) {
                        flag = false;
                        params.overSize && params.overSize.call(_this.obj, params.maxSize, file);
                    }
                    return flag;
                },
                overLimit:function (n) {
                    params.overLimit && params.overLimit.call(_this.obj, n);
                },
                notAllowType:function (file) {
                    params.notAllowType && params.notAllowType.call(_this.obj, file);
                }
            });

            $(this.obj).bind({
                successAdd:function (event, file, files) {
                    params.successAdd && params.successAdd.call(_this.obj, file);
                    _this.obj.upload(params.data);
                },
                failureAdd:function (event, file, files) {
                    params.failureAdd && params.failureAdd.call(_this.obj, file);
                },
                progress:function (event, e, file, loaded, total) {
                    params.progress && params.progress.call(_this.obj, file, loaded, total);
                },
                success:function (event, file, data) {
                    params.success && params.success.call(_this.obj, file, data);
                },
                failure:function (event, file, data) {
                    params.failure && params.failure.call(_this.obj, file, data);
                },
                error:function (event, file, data) {
                    params.failure && params.failure.call(_this.obj, file, data);
                },
                finish:function (event, file) {
                    params.finish && params.finish.call(_this.obj, file);
                },
                complete:function (event, file) {
                    params.complete && params.complete.call(_this.obj, file);
                }
            });
            if (params.dragable !== false) {
                $(_this.obj).bind({
                    dragenter:function (event, e, files, fileList) {
                        params.dragenter && params.dragenter.call(_this.obj, files, fileList);
                    },
                    dragover:function (event, e, files, fileList) {
                        params.dragover && params.dragover.call(_this.obj, files, fileList);
                    },
                    dragleave:function (event, e, files, fileList) {
                        params.dragleave && params.dragleave.call(_this.obj, files, fileList);
                    },
                    drop:function (event, e, files, fileList) {
                        params.drop && params.drop.call(_this.obj, files, fileList);
                    }
                });
            }

            $('#' + this.button).replaceWith('<a class="upload-select-btn" href="javascript:;" id="' + this.button + '"><input type="file" ' + (this.multi ? ' multiple="true"' : '') + '/></a>');
            $('#' + this.button + '>input').change(function () {
                var files = this.files;
                _this.obj.add(files);
            });
        };
        upload.prototype = {
            constructor: upload,
            reset: function() {
                var _this = this;
                this.obj.reset();
                $('#' + this.button).unbind('change');
                $('#' + this.button).replaceWith('<a class="upload-select-btn" href="javascript:;" id="' + this.button + '"><input type="file" ' + (this.multi ? ' multiple="true"' : '') + '/></a>');
                $('#' + this.button + '>input').change(function () {
                    var files = this.files;
                    _this.obj.add(files);
                });
                return this;
            },
            disable: function() {
                $('#' + this.button).addClass('upload-select-btn-dis');
                $('#' + this.button + '>input')[0].disabled = true;
                return this;
            },
            enable: function() {
                $('#' + this.button).removeClass('upload-select-btn-dis');
                $('#' + this.button + '>input')[0].disabled = false;
                return this;
            }
        };
    } else {
        upload = function(params) {
            var _this = this;
            (function() {
                for(var key in config) {
                    if(lang.isUndefined(params[key])) {
                        params[key] = config[key];
                    }
                }
            })();
            var maxSize = params.maxSize + 'B';
            (function(params, scope) {
                for(var key in params) {
                    scope[key] = params[key];
                }
            })(params, this);

            (function() {
                if(params.type) {
                    var t1 = params.type.toLowerCase();
                    var t2 = t1.toUpperCase();
                    params.type = t1 + ';' + t2;
                }
            })();

            this.obj = new swfupload({
                id: params.button,
                url:params.url,
                flash: params.flash,
                type: params.fileType,
                desc: params.desc ? params.desc : '选择文件',
                img: params.image,
                fileName: params.fileName,
                data: params.data,
                multi: params.multi,
                text: '',
                width: params.width,
                height: params.height,

                limit:params.limit,
                size: maxSize,

                overLimit:function (n) {
                    params.overLimit && params.overLimit.call(_this.obj, n);
                },
                zeroSize:function (file) {
                    params.zeroSize && params.zeroSize.call(_this.obj, file);
                },
                overSize:function (maxSize, file) {
                    params.overSize && params.overSize.call(_this.obj, maxSize, file);
                },
                notAllowType:function (file) {
                    params.notAllowType && params.notAllowType.call(_this.obj, file);
                },
                successAdd:function (file) {
                    params.successAdd && params.successAdd.call(_this.obj, file);
                },
                errorAdd:function (file, code, message) {
                    params.failureAdd && params.failureAdd.call(_this.obj, file);
                },
                progress:function (file, loaded, total) {
                    params.progress && params.progress.call(_this.obj, file, loaded, total);
                },
                success:function (file, data) {
                    params.success && params.success.call(_this.obj, file, $.parseJSON(data));
                },
                error:function (file, code, message) {
                    params.failure && params.failure.call(_this.obj, file, $.parseJSON(message));
                },
                finish:function (file) {
                    params.finish && params.finish.call(_this.obj, file);
                },
                complete:function (file) {
                    params.complete && params.complete.call(_this.obj, file);
                }
            });
        };
        upload.prototype = {
            constructor: upload,
            reset: function() {
                this.obj.reset();
                return this;
            },
            disable: function() {
                this.obj.disable();
                return this;
            },
            enable: function() {
                this.obj.enable();
                return this;
            }
        };
    }

    return upload;
});