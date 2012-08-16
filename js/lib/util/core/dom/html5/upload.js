define(function(require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../../../../../js/lib/util/core/lang.js');
    // var xxx = require('../../../../../../js/');

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
        this.status = 0; // 上传整体状态标识 0：未开始上传或上传完成，1：正在上传
        this.container = params.container ? $(params.container)[0] : document.body;
        this.url = params.url || '';
        this.filter = params.filter;
        this.beforeAdd = params.beforeAdd;

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
            if(this.status == 0) {
                var _this = this;
                var scope = $(this);
                var file = this.fileList[0];
                this.status = 1;
                if(file) {
                    var xhr = new XMLHttpRequest();
                    params = params || {};
                    if(xhr.upload) {
                        xhr.upload.addEventListener('progress', function(e) {
                            scope.trigger('progress', [e, file, e.loaded, e.total]);
                        }, false);

                        xhr.onreadystatechange = function(e) {
                            try {
                                if(xhr.readyState == 4) {
                                    var json = JSON.parse(xhr.responseText);
                                    if(xhr.status == 200) {
                                        if(json.code == 200) {
                                            scope.trigger('success', [file, json]);
                                            _this.successList.push(file);
                                        } else {
                                            scope.trigger('failure', [file, json]);
                                            _this.failureList.push(file);
                                        }
                                    } else {
                                        scope.trigger('error', [file, xhr.responseText]);
                                        _this.failureList.push(file);
                                    }
                                    _this.fileList.shift();
                                    _this.status = 0;
                                    if(_this.fileList.length == 0) {
                                        scope.trigger('complete', [file]);
                                    } else {
                                        _this.upload(params);
                                    }
                                }
                            } catch(e) {
                                scope.trigger('error', [file, xhr.responseText]);
                                _this.fileList.shift();
                                _this.status = 0;
                                if(_this.fileList.length == 0) {
                                    scope.trigger('complete', [file]);
                                } else {
                                    _this.upload(params);
                                }
                            }
                        };

                        xhr.open('POST', params.url || this.url, true);
                        xhr.setRequestHeader(_this.fileName, file.name); // 提供给服务端的file name
                        xhr.send(file);
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
            var arr = lang.callback(this.filter, {
                scope: this,
                params: [files, this.fileList]
            });
            if(arr !== false && !lang.isArray(arr)) {
                arr = files;
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
            return this;
        }
    };

    return html5Upload;
});