define(function(require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../lang');

    var config = {
        fileName: 'upfile',
        fileType: '*',
        limit: 50,
        max: 2,
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

    var isSupportHTML5Upload = false;

    (function () {
        if (typeof XMLHttpRequest != 'undefined') {
            var xhr = new XMLHttpRequest();
            isSupportHTML5Upload = !!xhr.upload;
        }
    })();

    /**
     * HTML5 上传
     * @param params
     */
    var html5Upload = function(params) {
        params = params || {};
        this.url = params.url || ''; // 上传的url
        this.fileName = params.fileName || config.fileName; // 传给服务端的name
        this.fileList = []; // 等待上传的文件队列
        this.successList = []; // 上传成功文件队列
        this.failureList = []; // 上传失败文件队列
        this.xhrList = {}; // 缓存住xhr的队列，用来给abort使用
        this.index = 0; // 文件索引
        this.status = 0; // 上传整体状态标识 0：未开始上传或上传完成，正数：正在上传的文件数量
        this.type = params.type || 'form'; // 默认form方式上传，还有blob, buffer，非这三个值则认为是DOM上传
        this.max = parseInt(params.max) || config.max; // 同时上传数量
        this.limit = parseInt(params.limit) || config.limit; // 最多上传的数量
        this.maxSize = helper.unit(params.maxSize ? params.maxSize : config.maxSize); // 单文件最大大小
        this.overLimit = params.overLimit; // (limit) 超过限制数量的回调
        this.notAllowType = params.notAllowType; // (file) 出现不允许类型的回调，会触发failure
        this.zeroSize = params.zeroSize; // (file) 空文件回调，会触发failureAdd事件
        this.overSize = params.overSize; // (file, size)超过限制大小，会触发failureAdd事件
        // 文件类型，使用扩展名，统配所有所占名用*，统配多个扩展名用半角封号;隔开
        this.fileType = (params.fileType && params.fileType.split(';')) || ['*'];
        (function(arr) {
            for(var i = 0, len = arr.length; i < len; i++) {
                arr[i] = $.trim(arr[i].toLowerCase()); // 把扩展名全部转小写
            }
        })(this.fileType);
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
                    params = params || {};
                    if(isSupportHTML5Upload) {
                        var xhr = new XMLHttpRequest();
                        this.xhrList[file.index] = xhr;

                        xhr.upload.addEventListener('progress', function(e) {
                            scope.trigger('progress', [e, file, e.loaded, e.total]);
                        }, false);

                        var finish = function(file) {
                            _this.status--;
                            delete _this.xhrList[file.index];
                            if(_this.fileList.length == 0) {
                                _this.xhrList = {};
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
                                scope.trigger('finish', [file]);
                            }
                        };
                        xhr.onerror = function(e) {
                            finish(file);
                        };
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
         * @param files
         * @return {*}
         */
        add: function(files) {
            var scope = $(this);
            var _this = this;
            var arr = files.length ? files : [files];
            if(files.length + this.successList.length > this.limit) {
                if(lang.isFunction(this.overLimit)) {
                    this.overLimit(this.limit);
                }
            } else {
                if(this.fileType[0] != '*') { // 过滤扩展名
                    (function(extArr, _this) {
                        var temp = [];
                        for(var i = 0, file; file = arr[i]; i++) {
                            var ext = file.name.split('.');
                            ext = ext[ext.length - 1].toLowerCase();
                            ext = '*.' + ext;
                            file.index = _this.index++;
                            if($.inArray(ext, extArr) != -1) {
                                temp.push(file);
                            } else {
                                if(lang.isFunction(_this.notAllowType)) {
                                    file.error = true;
                                    scope.trigger('failureAdd', [file, files]);
                                    _this.notAllowType(file);
                                }
                            }
                        }
                        arr = temp;
                    })(this.fileType, this);
                } else {
                    for(var i = 0, file; file = arr[i]; i++) {
                        file.index = _this.index++;
                    }
                }
                if(arr !== false) {
                    for(var i = 0, file; file = arr[i]; i++) {
                        var size = file.size;
                        if(size == 0) {
                            if(lang.isFunction(_this.zeroSize)) {
                                file.error = true;
                                scope.trigger('failureAdd', [file, files]);
                                this.zeroSize(file);
                            }
                        } else if(size > this.maxSize) {
                            if(lang.isFunction(_this.overSize)) {
                                file.error = true;
                                scope.trigger('failureAdd', [file, files]);
                                this.overSize(file, this.maxSize);
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
        reset: function(callback) {
            for(var key in this.xhrList) {
                var xhr = this.xhrList[key];
                if(xhr && xhr.abort) {
                    xhr.abort();
                }
            }
            this.fileList.length = 0;
            this.successList.length = 0; // 上传成功文件队列
            this.failureList.length = 0; // 上传失败文件队列
            this.xhrList = {};
            this.status = 0; // 上传整体状态标识 0：未开始上传或上传完成，>0：正在上传
            callback && callback.call(this);
            return this;
        },
        setUploadUrl: function(url) {
            this.url = url;
        },
        /**
         * 获取状态，返回值为0上传完成， 1存在未上传完成的文件
         * @return {Number}
         */
        getStatus: function() {
            var status = this.status;
            var result = 0; // 0 上传完成， 1 存在未上传完成的文件
            if(status > 0) { // 正在上传
                result = 1;
            } else {
                if(this.fileList.length > 0) { // 还存在未上传的文件
                    result = 1;
                }
            }
            return result;
        }
    };

    html5Upload.preview = function(file, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            callback && callback.call(this, file, this.result)
        };
    };

    html5Upload.isSupportHTML5Upload = isSupportHTML5Upload;

    return html5Upload;
});