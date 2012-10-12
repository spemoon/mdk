define(function(require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../lang');

    var config = {
        fileName: 'X-FILENAME'
    };
    /**
     * HTML5 上传
     * 对接受容器加入dragenter,dragover, dragleave, drop 事件
     * @param params
     */
    var html5Upload = function(params) {
        var _this = this;
        var scope = $(this);
        params = params || {};
        this.fileName = params.fileName || config.fileName; // 传给服务端的name
        this.fileList = [];
        this.successList = []; // 上传成功文件队列
        this.failureList = []; // 上传失败文件队列
        this.index = 0;
        this.status = 0; // 上传整体状态标识 0：未开始上传或上传完成，正数：正在上传的文件数量
        this.type = params.type || 'form'; // 默认form方式上传，还有blob, buffer，非这三个值则认为是DOM上传
        this.max = parseInt(params.max); // 同时上传数量
        this.max = this.max ? this.max : 2;
        this.limit = params.limit || 40; // 最多上传的数量
        this.container = lang.isUndefined(params.container) ? $(params.container)[0] : document.body;
        this.dragable = lang.isUndefined(params.dragable) ? true : !!this.dragable; // 是否允许拖拽上传，默认允许
        this.url = params.url || '';
        this.overLimit = params.overLimit;
        this.beforeAdd = params.beforeAdd;
        // 文件类型，使用扩展名，统配所有所占名用*，统配多个扩展名用半角逗号,隔开
        this.fileType = (params.fileType && params.fileType.split(',')) || ['*'];
        (function(arr) {
            for(var i = 0, len = arr.length; i < len; i++) {
                arr[i] = $.trim(arr[i].toLowerCase()); // 把扩展名全部转小写
            }
        })(this.fileType);

        if(this.dragable !== false) {
            this.container.addEventListener('dragenter', function(e) {
                scope.trigger('dragenter', [e, e.target]);
                e.stopPropagation();
                e.preventDefault();
            }, false);

            this.container.addEventListener('dragover', function(e) {
                scope.trigger('dragover', [e, e.target]);
                e.stopPropagation();
                e.preventDefault();
            }, false);

            this.container.addEventListener('dragleave', function(e) {
                scope.trigger('dragleave', [e, e.target]);
                e.stopPropagation();
                e.preventDefault();
            }, false);

            this.container.addEventListener('drop', function(e) {
                var files = e.target.files || e.dataTransfer.files;
                _this.add(files);
                scope.trigger('drop', [e, files, _this.fileList]);
                e.stopPropagation();
                e.preventDefault();
            }, false);
        }
    };

    html5Upload.prototype = {
        constructor: html5Upload,
        /**
         * 上传流程触发事件：
         *     progress(e, file, loaded, total): 进度
         *     success(file, json): 成功上传一个文件
         *     failure(file, json): 失败上传一个文件
         *     error(file, text): 服务端失败
         *     complete(file): 队列中没有待上传的文件，此次上传完成
         * @param params
         * @return {*}
         */
        upload: function(params) {
            if(this.status < this.max) {
                var _this = this;
                var scope = $(this);
                var file = _this.fileList.shift(); // 取队列头的文件上传
                this.status++;
                if(file) {
                    var xhr = new XMLHttpRequest();
                    params = params || {};
                    if(xhr.upload) {
                        xhr.upload.addEventListener('progress', function(e) {
                            scope.trigger('progress', [e, file, e.loaded, e.total]);
                        }, false);

                        var finish = function(file) {
                            _this.status--;
                            if(_this.fileList.length == 0) {
                                scope.trigger('complete', [file]);
                            } else {
                                _this.upload(params);
                            }
                        };
                        xhr.onload = function(e) {
                            try {
                                var json = JSON.parse(xhr.responseText);
                                if(json.code == 200) {
                                    scope.trigger('success', [file, json]);
                                    _this.successList.push(file);
                                } else {
                                    scope.trigger('failure', [file, json]);
                                    _this.failureList.push(file);
                                }
                            } catch(e) {
                                scope.trigger('error', [file, xhr.responseText]);
                                _this.failureList.push(file);
                            } finally {
                                finish(file);
                            }
                        };
                        xhr.onerror = function(e) {
                            finish(file);
                        };

                        var uploadUrl = this.url;
                        if(this.type == 'blob') {

                        }
                        xhr.open('POST', params.url || this.url, true);

                        if(this.type == 'form') {
                            var formData = new FormData();
                            (function() {
                                for(var key in params) { // 附加表单字段
                                    formData.append(key, params[key]);
                                }
                            })();
                            formData.append(this.fileName, file);
                            xhr.send(formData);
                        } else {
                            xhr.setRequestHeader(_this.fileName, file.name); // 提供给服务端的file name
                            (function() {
                                for(var key in params) { // 附加字段
                                    xhr.setRequestHeader(key, params[key]);
                                }
                            })();
                            if(this.type == 'blob') {
                                var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.BlobBuilder;
                                var bb = new BlobBuilder(), blob;
                                bb.append(file);
                                blob = bb.getBlob();
                                xhr.send(blob);
                            } else if(this.type == 'buffer') {
                                var reader = new FileReader();
                                reader.readAsArrayBuffer(file);
                                reader.onload = function() {
                                    xhr.send(this.result);
                                };
                            } else {
                                xhr.send(file);
                            }
                        }
                    }
                } else {
                    this.status = 0;
                }
            }
            return this;
        },
        /**
         * 增加文件
         *     filter(files, fileList): 过滤此次加入的文件列表
         *         返回false表示加入失败，触发errorAdd事件
         *         返回数组，表示过滤后
         *         其他返回值表示不过滤
         *
         *     在上面过滤后对每个文件触发beforeAdd切面
         *     beforeAdd(file, fileList):
         *         返回false表示不加入上传队列，触发failureAdd事件，file对象加入error属性
         *         其他触发successAdd事件，加入上传队列
         * @param files
         * @return {*}
         */
        add: function(files) {
            var scope = $(this);
            var arr = files.length ? files : [files];
            if(files.length + this.successList.length > this.limit) {
                if(lang.isFunction(this.overLimit)) {
                    this.overLimit(this.limit);
                }
            } else {
                if(this.fileType[0] != '*') { // 过滤扩展名
                    (function(extArr) {
                        var temp = [];
                        for(var i = 0, file; file = arr[i]; i++) {
                            var ext = file.name.split('.');
                            ext = ext[ext.length - 1].toLowerCase();
                            if($.inArray(ext, extArr) != -1) {
                                temp.push(file);
                            }
                        }
                        arr = temp;
                    })(this.fileType);
                }
                if(arr !== false) {
                    for(var i = 0, file; file = arr[i]; i++) {
                        file.index = this.index++;
                        if(lang.isFunction(this.beforeAdd)) {
                            if(lang.callback(this.beforeAdd, {
                                scope: this,
                                params: [file, this.fileList]
                            })) {
                                this.fileList.push(file);
                                scope.trigger('successAdd', [file, files]);
                            } else {
                                file.error = true;
                                scope.trigger('failureAdd', [file, files]);
                            }
                        } else {
                            this.fileList.push(file);
                            scope.trigger('successAdd', [file, files]);
                        }
                    }
                } else {
                    scope.trigger('errorAdd', [files]);
                }
            }
            return this;
        },
        /**
         * 重启一次上传，一般用于提交之后
         */
        reset: function() {
            this.successList = []; // 上传成功文件队列
            this.failureList = []; // 上传失败文件队列
            this.index = 0;
            this.status = 0; // 上传整体状态标识 0：未开始上传或上传完成，1：正在上传
            return this;
        }
    };

    return html5Upload;
});